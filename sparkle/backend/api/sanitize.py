import json

from flask import Blueprint
from flask import request

from util.sanitize_util import anonymize_text

from sparkle.backend.util.file_util import is_valid_file, get_text_from_file

api = Blueprint('sanitize_api', __name__)


@api.route('/', methods=['POST'])
def sanitize_data():
    """ Returns sanitized data back to user """
    text = request.form.get('text')
    file = request.files.get('file')

    allow_list = json.loads(request.form.get('allowList')) if request.form.get('allowList') else []
    deny_list = json.loads(request.form.get('denyList')) if request.form.get('denyList') else []

    if not text and not file:
        return json.dumps({'error': 'Must provide text or a file'}), 404

    if file:
        if not is_valid_file(file):
            return json.dumps({'error': f'Invalid file: {file.filename}'})
        text = get_text_from_file(file)

    sanitized_obj = anonymize_text(text_to_anonymize=text,
                                   allow_list=allow_list,
                                   deny_list=deny_list)
    sanitized_text = sanitized_obj.fake
    template = sanitized_obj.template

    original_spans = sorted(sanitized_obj.original_spans, key=lambda x: x['start'])
    sanitized_spans = sorted(sanitized_obj.spans, key=lambda x: x.start)

    for original_span, sanitized_span in zip(original_spans, sanitized_spans):
        sanitized_span.original_value = text[original_span['start']:original_span['end']]

    return json.dumps({
        'sanitized_text': sanitized_text,
        'original_text': text,
        'spans': [span.__dict__ for span in sanitized_spans],
        'template': template
    }), 200

