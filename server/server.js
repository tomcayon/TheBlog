// Importation des librairies
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const permissions = require('./permissions.json');
require('dotenv').config();


// Importation des variables d'environnement
const port = process.env.PORT || 3000;
let maintenance = false;
let BLOGNAME = process.env.NAME || "Blog";

// Configuration des middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


// Stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './content');
    },
    filename: (req, file, cb) => {
        // Wait 1 second to be sure that the file is created
            
            const title = req.body.title.toLowerCase().replace(/ /g, '-');
            
            const originalName = file.originalname;
            const fileExtension = path.extname(originalName); // Obtenez l'extension du fichier d'origine
            const baseName = path.basename(originalName, fileExtension); // Obtenez le nom de base du fichier

            let num = 0;
            let filename = `${title}${fileExtension}`;

            // Vérifiez si le fichier existe déjà
            while (fs.existsSync(path.join(__dirname, 'content', filename))) {
                // Supprimer le fichier existant
                fs.unlinkSync(path.join(__dirname, 'content', filename));
                filename = `${title}${fileExtension}`;
            }

            console.log("new file uploaded !");

            cb(null, filename);

    },
});

const upload = multer({ storage });

//Base de données
const db = new sqlite3.Database('./db.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// Table des articles (id, titre, contenu, couverture, date)
db.run('CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, titre TEXT, contenu TEXT, couverture TEXT, date TEXT)');
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, roles TEXT)');

// Creation d'une session
session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});

// Réccupération de la liste des permissions du role administrateur
const adminPermissions = Object.keys(permissions.administrator);
// Liste des rôles
const listroles = Object.keys(permissions);
// Pour chaques rôles, vérifier si les permissions sont les mêmes que le role administrateur
Object.keys(permissions).forEach((role) => {
    if (role !== 'administrator') {
        const rolePermissions = Object.keys(permissions[role]);
        adminPermissions.forEach((permission) => {
            if (!rolePermissions.includes(permission)) {
                // Ajouter la permission au rôle (valeur par défaut: false) dans le fichier permissions.json
                permissions[role][permission] = false;
                fs.writeFile('./permissions.json', JSON.stringify(permissions, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
        // Vérifier les permissions de chaques rôles, si administrator ne l'a pas, supprimer la permission
        listroles.forEach((role) => {
            const rolePermissions = Object.keys(permissions[role]);
            rolePermissions.forEach((permission) => {
                if (!adminPermissions.includes(permission)) {
                    delete permissions[role][permission];
                    fs.writeFile('./permissions.json', JSON.stringify(permissions, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                        }
                    });
                }
            });
        });
    }
});

// Création des routes
app.get('/api', (req, res) => {
    const token = req.cookies.token;
     if(token){
         //Get user info for send JSON
         try {
             const decoded = jwt.verify(token, "very-secret-key");
             const sql = 'SELECT * FROM users WHERE username = ?';
             db.get(sql, [decoded.username], (err, row) => {
                 if(err){
                     console.error(err);
                     res.status(500).send('Error retrieving user from database');
                     return;
                 }
                 if(row){
                     res.send({ username: row.username, roles: row.roles, id: row.id });
                 } else{
                     res.send(false);
                 }
             });
         } catch (error) {
             
             res.send(false);
            
         }
     } else{
         res.send(false);
     }
 });

app.post('/api/register', (req, res) => {
    const username = req.body.name;
    let password = req.body.password;
    let roles = req.body.role;
    // Hash password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    password = bcrypt.hashSync(password, salt);
    const sql = 'INSERT INTO users (username, password, roles) VALUES (?, ?, ?)';
    db.run(sql, [username, password, roles], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error registering new user into the database');
            return;
        }
        console.log('User registered into the database');
        res.send(true);
    });
});


app.get('/api/get-users', (req, res) => {
        const sql = 'SELECT * FROM users';
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error(err);
                res.status(500).send('Error retrieving users from database');
                return;
            }
            res.send(rows);
        });
});

app.get('/api/get-user/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT username, roles FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if(err){
            console.error(err);
            res.status(500).send('Error retrieving user from database');
            return;
        }
        res.send(row);
    });
});

app.post('/api/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, row) => {
        if(err){
            console.error(err);
            res.status(500).send('Error retrieving user from database');
            return;
        }
        if(row){
            const hash = row.password;
            const match = bcrypt.compareSync(password, hash);
            if(match){
                const token = jwt.sign({username},"very-secret-key",{expiresIn: '1h'});
                res.send({token});
            } else{
                res.send(false);
            }
        } else{
            res.send(false)
        }
    });
});

app.post('/api/edit-user/:id', (req, res) => {
    const id = req.params.id;
    const username = req.body.username;
    const roles = req.body.role;
    const sql = 'UPDATE users SET username = ?, roles = ? WHERE id = ?';
    db.run(sql, [username, roles, id], (err) => {
        if(err){
            console.error(err);
            res.status(500).send('Error updating user in database');
            return;
        }
    });
    if(req.body.password){
        const password = req.body.password;
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        const sql = 'UPDATE users SET password = ? WHERE id = ?';
        db.run(sql, [hash, id], (err) => {
            if(err){
                console.error(err);
                res.status(500).send('Error updating user in database');
                return;
            }
        });
    }
    res.send(true);
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.send(true);
});

app.post('/api/delete-user/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.run(sql, [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting user from database');
            res.send(false);
            return;
        }
        res.send(true);
    });
});

app.post('/api/new-article', upload.single('cover'), (req, res) => {
    const { title, content } = req.body;

    // Replace spaces to "-" from title to create ID
    const id = title.toLowerCase().replace(/ /g, '-');

    // Rename cover file with ID and save to ./content directory
    const date = new Date()
    //Formate date to DD-MM-YYYY-HH-MM-SS
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const dateFormated = `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`;

    let num = 0;

    // Get cover filename (id + extension but if file already exists, add a number to filename 'id(number).extension')
    let coverFilename = id + path.extname(req.file.originalname);
    if (fs.existsSync(path.join(__dirname, 'content', coverFilename))) {
        num++;
        let coverFilenamenumber = `${id}(${num})${path.extname(req.file.originalname)}`;
        if(fs.existsSync(path.join(__dirname, 'content', coverFilenamenumber))){
            while(fs.existsSync(path.join(__dirname, 'content', coverFilenamenumber))){
                num++;
                coverFilenamenumber = `${id}(${num})${path.extname(req.file.originalname)}`;
            }
            num--;
            coverFilename = `${id}(${num})${path.extname(req.file.originalname)}`;
        }
    }

    // Insert article data into the database
    const sql = 'INSERT INTO articles (id, titre, contenu, couverture, date) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [id, title, content, coverFilename, dateFormated], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error inserting article into the database');
            return;
        }
        res.send(true);
    });
});

//Récupération des articles & cover
app.get('/api/articles', (req, res) => {
    const sql = 'SELECT * FROM articles';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving articles from database');
            return;
        }
        res.send(rows);
    });
});

app.get('/api/articles/published', (req, res) => {
    const sql = 'SELECT * FROM articles WHERE status = "published"';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving articles from database');
            return;
        }
        res.send(rows);
    });
});

app.get('/api/articles/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM articles WHERE id = ?';
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving article from database');
            return;
        }
        res.send(row);
    });
});

app.post('/api/update-article/:id', upload.single('cover'), (req, res) => {
    const id = req.params.id;
    const titre = req.body.title;
    const contenu = req.body.content;
    const status = req.body.status;

    // Récupérer les anciennes données de l'article
    const sqlGet = 'SELECT * FROM articles WHERE id = ?';
    db.get(sqlGet, [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur lors de la récupération de l\'article depuis la base de données');
            return;
        }
        if (row) {
            const oldTitle = row.titre;
            let newId = row.id; // Conservez l'ancien ID par défaut

            // Si le titre est modifié, mettre à jour l'ID
            if (oldTitle !== titre) {
                newId = titre.toLowerCase().replace(/ /g, '-');
            }

            // Mettre à jour les données de l'article dans la base de données
            if (req.file && req.file.originalname) {
                const newCover = newId + path.extname(req.file.originalname);
                const sqlUpdate = 'UPDATE articles SET id = ?, titre = ?, contenu = ?, couverture = ?, status = ? WHERE id = ?';
                db.run(sqlUpdate, [newId, titre, contenu, newCover, status, id], (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Erreur lors de la mise à jour de l\'article dans la base de données');
                        return;
                    }
                    res.send(true);
                });
            } else {
                const sqlUpdate = 'UPDATE articles SET id = ?, titre = ?, contenu = ?, status = ? WHERE id = ?';
                db.run(sqlUpdate, [newId, titre, contenu, status, id], (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('Erreur lors de la mise à jour de l\'article dans la base de données');
                        return;
                    }
                    res.send(true);
                });
            }
        }
    });
});

app.get('/api/delete-article/:id', (req, res) => {
    const id = req.params.id;
    // Get cover to delete
    const sqlGet = 'SELECT * FROM articles WHERE id = ?';
    db.get(sqlGet, [id], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving article from database');
            return;
        }
        if (row) {
            const cover = row.couverture;
            // Delete cover
            fs.unlinkSync(path.join(__dirname, 'content', cover));
        }
    });

    const sql = 'DELETE FROM articles WHERE id = ?';
    db.run(sql, [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting article from database');
            return;
        }
        res.send(true);
    });

});


app.get('/api/cover/:cover', (req, res) => {
    const cover = req.params.cover;
    res.sendFile(path.join(__dirname, 'content', cover));
});


app.get('/api/permissions/:id/:permission', (req, res) => {
  const id = req.params.id;
  const permission = req.params.permission;

  // Obtenir les rôles de l'utilisateur depuis la base de données
  const sql = 'SELECT roles FROM users WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving user from database');
    }

    if (!row) {
      return res.send(false); // L'utilisateur n'a pas été trouvé
    }

    const roles = row.roles.split(','); // Supposons que les rôles sont stockés en tant que chaîne séparée par des virgules

    // Vérifier si l'utilisateur a la permission spécifiée
    let hasPermission = false;
    roles.forEach((role) => {
      if (permissions[role] && permissions[role][permission] === true) {
        hasPermission = true;
      }
    });

    res.send(hasPermission);
  });
});

app.get('/api/maintenance', (req, res) => {
    res.send(maintenance);
});

app.post('/api/maintenance/:bol', (req, res) => {
    maintenance = req.params.bol;
    res.send(true);
});

app.get('/api/get-name', (req, res) => {
    const blogName = BLOGNAME;  
    res.json(blogName);
});

app.post('/api/update-name', (req, res) => {
    // Require .env file
    console.log(req.body);
    const name = req.body.name;
    process.env.NAME = name;
    BLOGNAME = name;
    res.send(true);
});

app.post('/api/new-role', (req, res) => {
    const role = req.body;
    const rolename = role.name.toLowerCase();
    delete role.name;

    // Vérifier si le rôle existe déjà
    if (permissions[rolename]) {
        
        return res.send(false);
    }

    // Charger le fichier permissions.json existant
    const existingPermissions = JSON.parse(fs.readFileSync('./permissions.json', 'utf-8'));

    // Ajouter le nouveau rôle
    existingPermissions[rolename] = role;

    // Enregistrer le fichier mis à jour
    fs.writeFileSync('./permissions.json', JSON.stringify(existingPermissions, null, 2), 'utf-8');

    res.send(true);
});

app.get('/api/roles', (req, res) => {
    const roles = Object.keys(permissions);
    res.send(roles);
});

app.get('/api/role/:role', (req, res) => {
    // Vérifier que le rôle existe
    const role = req.params.role;
    if (!permissions[role]) {
        return res.status(404).send('Role not found');
    }
    res.send(permissions[role]);
});

app.get('/api/user-roles', (req, res) => {
    // Envoyer le nombre d'utilisateurs par rôle (role.users)
    const roles = Object.keys(permissions);
    const sql = 'SELECT * FROM users';
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs depuis la base de données');
        return;
      }
  
      const users = rows;
      let userRoles = [];
  
      roles.forEach((role) => {
        let roleObject = { name: role, users: 0 };
  
        users.forEach((user) => {
          if (user.roles.includes(role)) {
            roleObject.users += 1;
          }
        });
  
        userRoles.push(roleObject);
      });
  
      res.send(userRoles);
    });
});
  

app.get('/api/permissions-list', (req, res) => {
    //Get the first role in the permissions.json file and send list of permissions (delete true and false, just send permissions name)
    const role = Object.keys(permissions)[0];
    const permissionsList = Object.keys(permissions[role]);
    res.send(permissionsList);
});

app.get('/api/list-users-role/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT username, id FROM users WHERE roles = ?';
    
    db.all(sql, [id], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving users from database');
            return;
        }

        if (rows && rows.length > 0) {
            const users = rows.map(row => ({ username: row.username, id: row.id }));
            // Envoyez les noms d'utilisateur avec les ID
            res.json(users);
        } else {
            res.json([]); // Si aucun utilisateur n'est trouvé, renvoyez un tableau vide
        }
    });
});


app.get('/api/users',(req,res)=>{
    const sql = 'SELECT username FROM users';
    db.all(sql,[],(err,rows)=>{
        if(err){
            console.error(err);
            res.status(500).send('Error retrieving users from database');
            return;
        }
        res.send(rows);
    });
})

app.post('/api/test', upload.single('cover'), (req, res) => {
    if(req.file){
        console.log("File received");
        res.send(true)
    } else{
        res.status(400).send('No file uploaded');
    }
});

//Démarrage du serveur
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});