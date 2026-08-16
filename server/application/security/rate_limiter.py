from slowapi import Limiter
from slowapi.util import get_remote_address


# initialize limiter which uses IP address from the given user (get_remote_address) like a key
limiter = Limiter(key_func=get_remote_address)