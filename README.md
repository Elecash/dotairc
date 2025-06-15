# dotairc

A CLI tool to generate .airc files for AI agents based on your technology stack. This tool helps create consistent instructions for AI assistants working with your codebase.

## INSTALLATION

You can install the package globally:

    npm install -g dotairc

Or use it directly with npx:

    npx dotairc

## USAGE

Basic Usage:

Generate an .airc file for your project by specifying your technology stack:

```
npx dotairc --stack=angular,html,scss,nx
```

Supported Technologies:
- Angular
- NX
- SCSS
- HTML

## OUTPUT

The tool will generate an .airc file in your current directory, combining the instructions for all specified technologies. The generated file will include:

- Technology-specific best practices
- Critical requirements for each technology
- Architectural guidelines
- Code style requirements

## FILE STRUCTURE

The generated .airc file follows this structure:

```
# AI Agent Instructions

## [Technology 1]
[Instructions for Technology 1]

## [Technology 2]
[Instructions for Technology 2]

...
```

Then you can instruct your AI agents to read the .airc files and behave as explained by dotairc.

## CONTRIBUTING

Contributions are welcome! Feel free to:
1. Add new technology templates
2. Improve existing templates
3. Enhance the CLI functionality
4. Report bugs or suggest features

## LICENSE

MIT License

## AUTHOR

Raúl Jiménez (aka Elecash)

## CONTRIBUTORS

No one yet ☹️
