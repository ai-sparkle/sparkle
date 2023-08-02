import os

from PyPDF2 import PdfReader

VALID_FILETYPES = ['txt', 'pdf']


def get_filetype_from_file(file):
    return file.filename.split('.')[-1]


def is_valid_file(file):
    return get_filetype_from_file(file) in VALID_FILETYPES


def _get_text_from_pdf_file(pdf_file):
    reader = PdfReader(pdf_file)
    text = ''
    for page in reader.pages:
        text += page.extract_text() + '\n'
    return text.strip()


def _get_text_from_txt_file(txt_file):
    return txt_file.read().decode()


def get_text_from_file(file):
    filetype = get_filetype_from_file(file)
    if filetype == 'pdf':
        return _get_text_from_pdf_file(file)
    elif filetype == 'txt':
        return _get_text_from_txt_file(file)
    raise Exception(f'Unrecognized filetype: {filetype}')
