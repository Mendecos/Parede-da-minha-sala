# app/schemas.py

from . import ma
from .models import Admin, Arte
from marshmallow import fields, validate

# Define o esquema de validação e serialização para o modelo Admin
class AdminSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Admin   # O modelo SQLAlchemy que este esquema representa
        load_instance = True  # Opcional: desserializa para um objeto do modelo
        include_fk = True # Opcional: inclui chaves estrangeiras na serialização

# Instancia os esquemas para uso
# Para uma lista de admins

class ArteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Arte        
        load_instance = True
        include_fk = True
        dump_only = ("admin_id",)  # 🔴 ESSENCIAL


# Instancias

admin_schema = AdminSchema() # Para um único admin
admins_schema = AdminSchema(many=True)
arte_schema = ArteSchema()
artes_schema = ArteSchema(many=True)
