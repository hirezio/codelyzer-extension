# HiRez.io Codelyzer Extension

This repo aims to prevent developers from making less obvious, but crucial mistakes in their Angular code.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Installation

`npm install -D @hirezio/codelyzer-extension`

## Configuration

TBD


## `ShareModule()` Decorator

Add the `SharedModule()` decorator before any `NgModule()` that is suppose to be imported multiple times across your app.

If you try to define any providers inside of the NgModule metadata object, tslint will throw an error.

## `Statless()` Decorator

Add the `Stateless()` decorator before any `Injectable()` that is suppose to be stateless (no properties). 
If you try to define any local properties on this service, it'll throw an error.

This is not perfect, because you could still save states on dependent services, but it's here to signal the other developers on the team that this should be a stateless service. 

## License

MIT
