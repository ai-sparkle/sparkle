from presidio_analyzer import PatternRecognizer
from presidio_anonymizer import AnonymizerEngine
from presidio_evaluator.data_generator import PresidioDataGenerator

from typing import Optional, List

from sparkle.backend.singleton import get_analyzer_engine_singleton

# We need to have this mapping because the Presidio's provider name
# and the our faker generator has different names.
# Please see https://github.com/microsoft/presidio-research/blob/66e243336fcf0a56281bb51831b492f79d087435/presidio_evaluator/data_generator/presidio_pseudonymize.py#L21
# for the detailed list of the
ENTITY_MAP = {
    'EMAIL_ADDRESS': 'email',
    'PERSON': 'name',
    'PHONE_NUMBER': 'phone_number',
    # TODO: We have not found a good way to generate PII in PresidioDataGenerator so generate a iban
    # if it is generic_PII
    'GENERIC_PII': 'iban',
    'IP_ADDRESS': 'ipv4',
    'ORGANIZATION': 'company',
    'LOCATION': 'country',
    'CREDIT_CARD': 'credit_card_number',
    'IBAN_CODE': 'iban',
    'DOMAIN_NAME': 'url',
    'US_SSN': 'ssn',
    'DATE_TIME': 'date_time'
}

DEFAULT_ENTITIES = list(ENTITY_MAP.keys())


def anonymize_text(text_to_anonymize: str, entities: Optional[List[str]] = None,
                   deny_list: Optional[List[str]] = None,
                   allow_list: Optional[List[str]] = None,
                   language: str = 'en'):
    """ Anonymize text

    Args:
        text_to_anonymize: a string that needs dto be anonymized.
        entities: an list of strings that includes all the entities we will look for.
        deny_list: an list of strings that contains all the words that are not considered PII, but are detected as such.
        allow_list: an list of string that contains words that are considered PII, but are not detected as such.
        language: a string for the language

    Returns:
         a FakerSpansResult that includes information about the PII and the synthesized results.
    """
    entities = entities or DEFAULT_ENTITIES
    # We always add GENERIC_PII because that is needed for the denylist.
    entities = list(entities) + ["GENERIC_PII"]
    analyzer = get_analyzer_engine_singleton()
    ad_hoc_recognizers = []
    if deny_list:
        denylist_recognizer = PatternRecognizer(
            supported_entity="GENERIC_PII", deny_list=deny_list
        )
        ad_hoc_recognizers.append(denylist_recognizer)

    analyzer_results = analyzer.analyze(text=text_to_anonymize,
                                        entities=entities,
                                        allow_list=allow_list,
                                        language=language,
                                        ad_hoc_recognizers=ad_hoc_recognizers)
    # pass Analyzer results into the anonymizer
    anonymizer = AnonymizerEngine()
    anonymized_results = anonymizer.anonymize(
        text=text_to_anonymize, analyzer_results=analyzer_results)


    def convert_template(input_template):
        for k, v in ENTITY_MAP.items():
            input_template = input_template.replace(f'<{k}>', '{{' + v + '}}')
        return input_template

    sentence_template_txt = convert_template(anonymized_results.text)

    sentence_templates = [sentence_template_txt]
    data_generator = PresidioDataGenerator()
    fake_records = data_generator.generate_fake_data(
        templates=sentence_templates, n_samples=1)
    fake_records_list = list(fake_records)
    result = fake_records_list[0]
    return result
