from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

ANALYZER = AnalyzerEngine()
ENTITY_MAP = {
        'EMAIL_ADDRESS': 'email',
        'PERSON': 'name',
        'PHONE_NUMBER': 'phone_number'
}


def anonymize_text(text_to_anonymize):
    analyzer_results = ANALYZER.analyze(text=text_to_anonymize,
                                        entities=["EMAIL_ADDRESS", "PERSON", "PHONE_NUMBER"],
                                        language='en')
    # pass Analyzer results into the anonymizer
    anonymizer = AnonymizerEngine()
    anonymized_results = anonymizer.anonymize(
        text=text_to_anonymize,
        analyzer_results=analyzer_results
    )

    def convert_template(input_template):
        for k, v in ENTITY_MAP.items():
            input_template = input_template.replace(f'<{k}>', '{{' + v + '}}')
        return input_template

    sentence_template_txt = convert_template(anonymized_results.text)

    from presidio_evaluator.data_generator import PresidioDataGenerator

    sentence_templates = [sentence_template_txt]
    data_generator = PresidioDataGenerator()
    fake_records = data_generator.generate_fake_data(
        templates=sentence_templates, n_samples=10
    )

    fake_records_list = list(fake_records)
    output_text = fake_records_list[0]

    return output_text
