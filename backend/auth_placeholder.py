"""
AUTHENTICATION PLACEHOLDER for Thibaut
======================================

This file serves as a starting point for the Auth implementation.

Responsibilities (Thibaut):
1.  Implement JWT handling (create_access_token, verify_token).
2.  Create API router for:
    - POST /auth/register
    - POST /auth/login
    - GET /auth/me
3.  Secure endpoints in `main.py` using `Depends(get_current_user)`.

Notes:
- Use `passlib` for password hashing.
- Coordinate with Israel for the User model in the DB.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Validate token and return user.
    To be implemented.
    """
    # decode token, fetch user from DB...
    pass
