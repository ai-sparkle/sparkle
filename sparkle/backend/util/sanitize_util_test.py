#!/usr/bin/env python
import unittest
from sparkle.backend.util.sanitize_util import anonymize_text


class TestAnonymizeText(unittest.TestCase):
    """Anonymize Text Tests"""

    def setUp(self):
        self._input_text = """
Here are a few example sentences we currently support:

Hello, my name is David Johnson and I live in Maine.
My credit card number is 4095-2609-9393-4932 and my crypto wallet id is 16Yeky6GMjeNkAiNcBY7ZhrLoMSgg1BoyZ.

On September 18 I visited microsoft.com and sent an email to test@presidio.site,  from the IP 192.168.0.1.

My passport: 191280342 and my phone number: (212) 555-1234.

This is a valid International Bank Account Number: IL150120690000003111111 . Can you please check the status on bank account 954567876544?

Kate's social security number is 078-05-1126.  Her driver license? it is 1234567A.
"""
        self._default_entities = ("EMAIL_ADDRESS", "PERSON", "PHONE_NUMBER")

    def test_sanitize_text(self):
        self.maxDiff = None
        output = anonymize_text(self._input_text, entities=self._default_entities)
        expected_template = (
            "Here are a few example sentences we currently support:\n\n"
            "Hello, my name is {{name}} and I live in Maine.\n"
            "My credit card number is 4095-2609-9393-4932 "
            "and my crypto wallet id is 16Yeky6GMjeNkAiNcBY7ZhrLoMSgg1BoyZ.\n\n"
            "On September 18 I visited microsoft.com and sent an email to {{email}},  "
            "from the IP 192.168.0.1.\n\n"
            "My passport: 191280342 and my phone number: {{phone_number}}.\n\n"
            "This is a valid International Bank Account Number: IL150120690000003111111 . "
            "Can you please check the status on bank account 954567876544?\n\n"
            "{{name}}'s social security number is {{phone_number}}.  "
            "Her driver license? it is 1234567A.")
        self.assertEqual(expected_template, output.template)

    def test_sanitize_text_default_entities(self):
        self.maxDiff = None
        output = anonymize_text(self._input_text)
        expected_template = ("Here are a few example sentences we currently support:\n\n"
                             "Hello, my name is {{name}} and I live in {{country}}.\n"
                             "My credit card number is {{credit_card_number}} and my crypto wallet id is 16Yeky6GMjeNkAiNcBY7ZhrLoMSgg1BoyZ.\n\n"
                             "On {{date_time}} I visited microsoft.com and sent an email to {{email}},  from the IP {{ipv4}}.\n\n"
                             "My passport: {{ssn}} and my phone number: {{phone_number}}.\n\n"
                             "This is a valid International Bank Account Number: {{iban}} . Can you please check the status on bank account 954567876544?\n\n"
                             "{{name}}'s social security number is {{ssn}}.  Her driver license? it is 1234567A.")
        self.assertEqual(expected_template, output.template)

    def test_sanitize_text_with_allow_list(self):
        self.maxDiff = None

        output = anonymize_text(self._input_text, entities=self._default_entities, allow_list=['(212) 555-1234'])
        expected_template = (
            "Here are a few example sentences we currently support:\n\n"
            "Hello, my name is {{name}} and I live in Maine.\n"
            "My credit card number is 4095-2609-9393-4932 "
            "and my crypto wallet id is 16Yeky6GMjeNkAiNcBY7ZhrLoMSgg1BoyZ.\n\n"
            "On September 18 I visited microsoft.com and sent an email to {{email}},  "
            "from the IP 192.168.0.1.\n\n"
            "My passport: 191280342 and my phone number: (212) 555-1234.\n\n"
            "This is a valid International Bank Account Number: IL150120690000003111111 . "
            "Can you please check the status on bank account 954567876544?\n\n"
            "{{name}}'s social security number is {{phone_number}}.  "
            "Her driver license? it is 1234567A.")
        self.assertEqual(expected_template, output.template)

    def test_sanitize_text_with_deny_list(self):
        self.maxDiff = None

        output = anonymize_text(self._input_text, entities=self._default_entities, deny_list=['Can you please'])
        expected_template = (
            "Here are a few example sentences we currently support:\n\n"
            "Hello, my name is {{name}} and I live in Maine.\n"
            "My credit card number is 4095-2609-9393-4932 "
            "and my crypto wallet id is 16Yeky6GMjeNkAiNcBY7ZhrLoMSgg1BoyZ.\n\n"
            "On September 18 I visited microsoft.com and sent an email to {{email}},  "
            "from the IP 192.168.0.1.\n\n"
            "My passport: 191280342 and my phone number: {{phone_number}}.\n\n"
            "This is a valid International Bank Account Number: IL150120690000003111111 . "
            "{{iban}} check the status on bank account 954567876544?\n\n"
            "{{name}}'s social security number is {{phone_number}}.  "
            "Her driver license? it is 1234567A.")
        self.assertEqual(expected_template, output.template)


if __name__ == "__main__":
    unittest.main()
