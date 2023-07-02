FROM python:3.11-alpine AS build

WORKDIR /app
COPY requirements.txt .
RUN python3 -m venv /venv

ENV PYTHONPATH=/venv

RUN /venv/bin/pip install -U pip
RUN /venv/bin/pip install -r requirements.txt

FROM python:3.11-alpine

WORKDIR /app
COPY --from=build /venv /venv
COPY . .

ENV PYTHONPATH=/venv

CMD [ "/venv/bin/python", "main.py" ]
