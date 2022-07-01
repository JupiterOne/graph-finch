# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2021-11-24

### Added

- Initial exploratory implementation of ingestion using Finch.
- Added support for ingesting the following **new** resources:

| Resources | Entity `_type`  | Entity `_class` |
| --------- | --------------- | --------------- |
| Account   | `finch_account` | `Account`       |
| User      | `finch_user`    | `User`          |

- Added support for ingesting the following **new** relationships:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `finch_account`       | **HAS**               | `finch_user`          |
| `finch_account`       | **MANAGES**           | `finch_user`          |
