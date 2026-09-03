# Security Policy

## Scope

The current browser application reads only files and folders explicitly selected by the user. It does not include a file-upload API. The future desktop runtime will require additional review for drive monitoring, Python execution, package installation, and filesystem writes.

## Reporting a vulnerability

Please do not open a public issue for a suspected security vulnerability. Contact the repository maintainer privately through the GitHub profile for **Diwas Khatri** and include a clear description, affected version, reproduction steps, and potential impact. Avoid attaching private USB files; use a minimal reproducible sample whenever possible.

## Safe handling principles

Never commit credentials, private files, generated USB indexes, or personal data. Native-runtime features must request explicit permissions, keep execution sandboxed, and make drive access visible to the user. Security-sensitive changes should include a short threat-model note in the pull request.
