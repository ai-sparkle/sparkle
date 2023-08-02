from presidio_analyzer import AnalyzerEngine

_SINGLETONS = {}


def _get_singleton(key, constructor):
    if key not in _SINGLETONS:
        _SINGLETONS[key] = constructor()
    return _SINGLETONS[key]


def get_analyzer_engine_singleton():
    return _get_singleton('ANALYZER', AnalyzerEngine)
