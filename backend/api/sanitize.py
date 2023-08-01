import json

from flask import Blueprint
from flask import request

from util.sanitize_util import anonymize_text

api = Blueprint('sanitize_api', __name__)


@api.route('/', methods=['POST'])
def sanitize_data():
    """ Returns sanitized data back to user """
    text = request.json.get('text')

    if not text:
        return json.dumps({'error': 'text not provided'}), 404

    sanitized_text = anonymize_text(text)
    return json.dumps({'sanitized_text': str(sanitized_text)}), 200
