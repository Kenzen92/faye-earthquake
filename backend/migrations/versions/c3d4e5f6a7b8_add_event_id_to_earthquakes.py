"""add event_id to earthquakes

Revision ID: c3d4e5f6a7b8
Revises: b4236b882e64
Create Date: 2026-04-26 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c3d4e5f6a7b8'
down_revision: Union[str, Sequence[str], None] = 'b4236b882e64'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('earthquakes', sa.Column('event_id', sa.String(), nullable=True))
    op.create_index('ix_earthquakes_event_id', 'earthquakes', ['event_id'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_earthquakes_event_id', table_name='earthquakes')
    op.drop_column('earthquakes', 'event_id')
