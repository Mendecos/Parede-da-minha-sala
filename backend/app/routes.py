
from flask import request, jsonify, Blueprint
from . import db, bcrypt
from .models import Admin, Usuario, Livro, Avaliacao
from .schemas import (
    admin_schema, admins_schema,
    usuario_schema, usuarios_schema,
    livro_schema, livros_schema,
    avaliacao_schema, avaliacoes_schema
)
from marshmallow import ValidationError
from flask_jwt_extended import create_access_token, get_jwt, jwt_required, get_jwt_identity

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

@main.route('/usuarios', methods=['POST'])
def criar_usuario():
    json_data = request.get_json()
    try:
        novo_usuario = usuario_schema.load(json_data)        
        senha_texto = json_data['senha']
        senha_hash = bcrypt.generate_password_hash(senha_texto).decode('utf-8')
        novo_usuario.senha = senha_hash

    except ValidationError as err:
        return jsonify(err.messages), 400
    
    db.session.add(novo_usuario)
    db.session.commit()
    
    return jsonify({
        "message": "Usuário criado com sucesso!",
        # Usamos o dump para não retornar a senha no JSON de resposta
        "usuario": usuario_schema.dump(novo_usuario) 
    }), 201
@main.route('/usuarios', methods=['GET'])
def get_usuarios():
    usuarios = Usuario.query.all()
    # O schema cuida de toda a conversão para JSON!
    return usuarios_schema.dump(usuarios)

@main.route('/usuarios/<int:usuario_id>', methods=['PUT'])
def update_usuario(usuario_id):
    # Encontra o usuario pelo ID. Se não achar, retorna erro 404 (Not Found)
    usuario = Usuario.query.get_or_404(usuario_id)
    
    # Pega os novos dados da requisição
    dados = request.get_json()
    
    # Atualiza os campos do objeto usuario
    usuario.nome = dados['nome']
    usuario.email = dados['email']
    # (Não atualizamos a senha aqui por simplicidade, mas seria possível)
    
    # Salva as alterações no banco de dados
    db.session.commit()
    
    return jsonify({'message': 'usuario atualizado com sucesso!'})

@main.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
def delete_usuario(usuario_id):
    # Encontra o usuario pelo ID. Se não achar, retorna erro 404 (Not Found)
    usuario = Usuario.query.get_or_404(usuario_id)
    
    db.session.delete(usuario)
    
    # Salva as alterações no banco de dados
    db.session.commit()
    
    return jsonify({'message': 'usuario deleteado com sucesso!'})

# --- CRUD Livro ---
@main.route('/livros', methods=['GET'])
def get_livros():
    livros = Livro.query.all()
    return livros_schema.dump(livros)

@main.route('/livros', methods=['POST'])
@jwt_required()
def criar_livro():

    dados = request.get_json()

    print("DADOS RECEBIDOS:", dados)

    try:
        novo_livro = livro_schema.load(dados)

    except ValidationError as err:

        print("ERRO:", err.messages)

        return jsonify(err.messages), 400

    admin_id = int(get_jwt_identity())

    novo_livro.admin_id = admin_id

    db.session.add(novo_livro)
    db.session.commit()

    return jsonify(livro_schema.dump(novo_livro)), 201
@main.route('/livros/<int:livro_id>', methods=['PUT'])
def update_livro(livro_id):
    livro = Livro.query.get_or_404(livro_id)
    json_data = request.get_json()
    try:
        # partial=True permite a atualização de apenas alguns campos
        livro_atualizado = livro_schema.load(json_data, instance=livro, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    db.session.commit()
    return jsonify({"message": "Livro atualizado com sucesso!", "livro": livro_schema.dump(livro_atualizado)})

@main.route('/livros/<int:livro_id>', methods=['DELETE'])
def delete_livro(livro_id):
    livro = Livro.query.get_or_404(livro_id)
    db.session.delete(livro)
    db.session.commit()
    return jsonify({"message": "Livro deletado com sucesso!"})

# --- CRUD Avaliacao ---
@main.route('/avaliacoes', methods=['GET'])
def get_avaliacoes():
    avaliacoes = Avaliacao.query.all()
    return avaliacoes_schema.dump(avaliacoes)

@main.route('/avaliacoes', methods=['POST'])
@jwt_required() 
def criar_avaliacao():
    usuario_id_atual = get_jwt_identity()
    
    dados = request.get_json()
    
    try:
        nova_avaliacao = avaliacao_schema.load(dados)
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    nova_avaliacao.usuario_id = usuario_id_atual
    
    db.session.add(nova_avaliacao)
    db.session.commit()
    
    return jsonify({
        "message": "Avaliação criada com sucesso!", 
        "avaliacao": avaliacao_schema.dump(nova_avaliacao)
    }), 201

@main.route('/avaliacoes/<int:avaliacao_id>', methods=['PUT'])
def update_avaliacao(avaliacao_id):
    avaliacao = Avaliacao.query.get_or_404(avaliacao_id)
    json_data = request.get_json()
    try:
        avaliacao_atualizada = avaliacao_schema.load(json_data, instance=avaliacao, partial=True, only=('comentario', 'estrelas'))
    except ValidationError as err:
        return jsonify(err.messages), 400
    
    db.session.commit()
    return jsonify({"message": "Avaliação atualizada com sucesso!", "avaliacao": avaliacao_schema.dump(avaliacao_atualizada)})

@main.route('/avaliacoes/<int:avaliacao_id>', methods=['DELETE'])
def delete_avaliacao(avaliacao_id):
    avaliacao = Avaliacao.query.get_or_404(avaliacao_id)
    db.session.delete(avaliacao)
    db.session.commit()
    return jsonify({"message": "Avaliação deletada com sucesso!"})

@main.route('/login', methods=['POST'])
def login_usuario():
    json_data = request.get_json()
    email = json_data.get('email')
    senha = json_data.get('senha')

    # Validação simples para garantir que os campos foram enviados
    if not email or not senha:
        return jsonify({"message": "Email e senha são obrigatórios"}), 400

    # Busca o usuário pelo email no banco de dados
    usuario = Usuario.query.filter_by(email=email).first()

    # Verifica se o usuário existe E se a senha enviada corresponde ao hash salvo
    if usuario and bcrypt.check_password_hash(usuario.senha, senha):
        access_token = create_access_token(identity=str(usuario.id))
        return jsonify(access_token=access_token)
    
    # Se o usuário não existe ou a senha está incorreta
    return jsonify({"message": "Credenciais inválidas"}), 401
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

