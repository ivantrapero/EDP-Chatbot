import random
import json

def search_dataset(user_message):
    # your dataset search logic here
    return None, []  # (answer, choices)

def shuffle_choices(options):
    if not options:
        return []
    shuffled = options[:]
    random.shuffle(shuffled)
    return shuffled
