from flask import Flask
from flask_cors import CORS

from api.sanitize import api as sanitize_api

app = Flask(__name__)


app.register_blueprint(sanitize_api, url_prefix='/sanitize', name='sanitize')

cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/status')
def status():
    return 'ok'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
