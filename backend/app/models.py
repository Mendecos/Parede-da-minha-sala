from . import db

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)


class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    senha = db.Column(db.String(255), nullable=False)



class Livro(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(255), nullable=False)
    genero = db.Column(db.String(100))
    autor = db.Column(db.String(255))
    preco = db.Column(db.Float)
    sinopse = db.Column(db.Text)
    foto = db.Column(db.Text)
    num_total = db.Column(db.Integer)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    def to_dict(self):
        return {
            'id': self.id,
            'titulo': self.titulo,
            'genero': self.genero,
            'autor': self.autor,
            'preco': self.preco,
            'sinopse': self.sinopse,
            'foto': self.foto,
            'num_total': self.num_total,
            'admin_id': self.admin_id
        }


class Avaliacao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    comentario = db.Column(db.Text)
    estrelas = db.Column(db.Integer, nullable=False)
    data = db.Column(db.DateTime, default=db.func.current_timestamp())
    livro_id = db.Column(db.Integer, db.ForeignKey('livro.id'), nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False)
    def to_dict(self):
        return {
            'id': self.id,
            'comentario': self.comentario,
            'estrelas': self.estrelas,
            'data': self.data,
            'livro_id': self.livro_id,
            'usuario_id': self.usuario_id
        }