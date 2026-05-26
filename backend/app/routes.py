
from flask import request, jsonify, Blueprint
from . import db, bcrypt
from .models import Admin, Arte
from .schemas import (
    admin_schema, admins_schema,
    arte_schema, artes_schema,
)
from marshmallow import ValidationError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

main = Blueprint('main', __name__)

@main.route("/")
def read_root():
    return jsonify({"message": "API Flask com Modelo Admin definido!"})
@main.route('/admins', methods=['POST'])
def criar_admin():
    json_data = request.get_json()
    try:
        # O schema carrega e valida os dados recebidos
        novo_admin = admin_schema.load(json_data)
        senha_texto = json_data['senha']
        senha_hash = bcrypt.generate_password_hash(senha_texto).decode('utf-8')
        novo_admin.senha = senha_hash
    except ValidationError as err:
        # Se a validação falhar, retorna um erro 400 com as mensagens
        return jsonify(err.messages), 400

    # Adiciona o novo objeto validado ao banco
    db.session.add(novo_admin)
    db.session.commit()

    # Retorna uma mensagem e o objeto que foi criado
    return jsonify({
        "message": "Admin criado com sucesso!",
        "admin": admin_schema.dump(novo_admin)
    }), 201

@main.route('/admins', methods=['GET'])
def get_admins():
    admins = Admin.query.all()
    # O schema cuida de toda a conversão para JSON!
    return admins_schema.dump(admins)

@main.route('/admins/<int:admin_id>', methods=['PUT'])
def update_admin(admin_id):
    # Encontra o admin pelo ID. Se não achar, retorna erro 404 (Not Found)
    admin = Admin.query.get_or_404(admin_id)
    
    # Pega os novos dados da requisição
    dados = request.get_json()
    
    # Atualiza os campos do objeto admin
    admin.nome = dados['nome']
    admin.email = dados['email']
    # (Não atualizamos a senha aqui por simplicidade, mas seria possível)
    
    # Salva as alterações no banco de dados
    db.session.commit()
    
    return jsonify({'message': 'Admin atualizado com sucesso!'})

@main.route('/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    # Encontra o admin pelo ID. Se não achar, retorna erro 404 (Not Found)
    admin = Admin.query.get_or_404(admin_id)
    
    db.session.delete(admin)
    
    # Salva as alterações no banco de dados
    db.session.commit()
    
    return jsonify({'message': 'Admin deleteado com sucesso!'})


# --- CRUD Arte ---
@main.route('/artes', methods=['GET'])
def get_artes():
    artes = Arte.query.all()
    return artes_schema.dump(artes)

@main.route('/artes', methods=['POST'])
@jwt_required()
def criar_arte():

    dados = request.get_json()

    print("DADOS RECEBIDOS:", dados)

    try:
        novo_arte = arte_schema.load(dados)

    except ValidationError as err:

        print("ERRO:", err.messages)

        return jsonify(err.messages), 400

    admin_id = int(get_jwt_identity())

    novo_arte.admin_id = admin_id

    db.session.add(novo_arte)
    db.session.commit()

    return jsonify(arte_schema.dump(novo_arte)), 201
@main.route('/artes/<int:arte_id>', methods=['PUT'])
def update_arte(arte_id):
    arte = Arte.query.get_or_404(arte_id)
    json_data = request.get_json()
    try:
        # partial=True permite a atualização de apenas alguns campos
        arte_atualizada = arte_schema.load(json_data, instance=arte, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    db.session.commit()
    return jsonify({"message": "Arte atualizada com sucesso!", "arte": arte_schema.dump(arte_atualizada)})

@main.route('/artes/<int:arte_id>', methods=['DELETE'])
def delete_arte(arte_id):
    arte = Arte.query.get_or_404(arte_id)
    db.session.delete(arte)
    db.session.commit()
    return jsonify({"message": "Arte deletada com sucesso!"})


@main.route('/login_admin', methods=['POST'])
def login_admin():
    json_data = request.get_json()

    email = json_data.get('email')
    senha = json_data.get('senha')

    if not email or not senha:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    admin = Admin.query.filter_by(email=email).first()

    if admin and bcrypt.check_password_hash(admin.senha, senha):
        access_token = create_access_token(
            identity=str(admin.id),  # 🔴 SEMPRE STRING
            additional_claims={"role": "admin"}
        )

        return jsonify({
            "access_token": access_token
        }), 200

    return jsonify({"message": "Credenciais inválidas"}), 401


@main.route('/teste', methods=['GET'])
def teste():
    return {"ok": True}

