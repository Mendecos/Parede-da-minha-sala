# app/schemas.py

from . import ma
from .models import Admin, Usuario, Livro, Avaliacao
from marshmallow import fields, validate

# Define o esquema de validação e serialização para o modelo Admin
class AdminSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Admin   # O modelo SQLAlchemy que este esquema representa
        load_instance = True  # Opcional: desserializa para um objeto do modelo
        include_fk = True # Opcional: inclui chaves estrangeiras na serialização


# Instancia os esquemas para uso
 # Para uma lista de admins

# Define o esquema de validação e serialização para o modelo Admin
class UsuarioSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Usuario   # O modelo SQLAlchemy que este esquema representa
        load_instance = True  # Opcional: desserializa para um objeto do modelo
        include_fk = True # Opcional: inclui chaves estrangeiras na serialização

# Instancia os esquemas para uso
 # Para uma lista de Usuarios

class LivroSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Livro
        load_instance = True
        include_fk = True
        dump_only = ("admin_id",)  # 🔴 ESSENCIAL


class AvaliacaoSchema(ma.SQLAlchemyAutoSchema):
    estrelas = fields.Int(
        required=True, # Torna o campo obrigatório
        validate=validate.Range(min=1, max=5, error="O valor das estrelas deve ser entre 1 e 5.")
    )
    class Meta:
        model = Avaliacao
        load_instance = True
        include_fk = True # Importante para incluir livro_id e usuario_id
        dump_only = ("usuario_id", "data")


# Instancias
usuario_schema = UsuarioSchema() # Para um único Usuario
usuarios_schema = UsuarioSchema(many=True)
admin_schema = AdminSchema() # Para um único admin
admins_schema = AdminSchema(many=True)
livro_schema = LivroSchema()
livros_schema = LivroSchema(many=True)
avaliacao_schema = AvaliacaoSchema()
avaliacoes_schema = AvaliacaoSchema(many=True)