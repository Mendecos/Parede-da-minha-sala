from . import db

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)



class Arte(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    genero = db.Column(db.String(100))
    artista = db.Column(db.String(255))
    descricao = db.Column(db.Text)
    foto = db.Column(db.Text)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'genero': self.genero,
            'artista': self.artista,
            'descricao': self.descricao,
            'foto': self.foto,
            'admin_id': self.admin_id
        }

