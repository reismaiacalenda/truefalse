import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  renameTemplateFiles,
  Rule,
  SchematicContext,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import {
  basename,
  dirname,
  normalize,
  Path,
  strings
} from '@angular-devkit/core';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { gerarCampos, alimentarFormulario, showDataTable, showColunasDataTable, gerarListEntidades } from './gerador';

export function andaime(_options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new Error('Could not find Angular workspace configuration');
    }

    // convert workspace settings to string
    const workspaceContent = workspaceConfig.toString();

    // parse workspace string into JSON object
    const workspace: WorkspaceDefinition = JSON.parse(
      workspaceContent
    );

    // get project name
    if (!_options.project) {
      const [firstProjectName] = Array.from(workspace.projects.keys());
      _options.project = firstProjectName;
    }

    const projectName = _options.project as string;
    const project = workspace.projects.get(projectName);
    if (!project) {
      throw new Error(`Project "${projectName}" not found in workspace.`);
    }
    const projectType = project.extensions['projectType'] === 'application' ? 'app' : 'lib';

    // Get the path to create files
    if (_options.path === undefined) {
      _options.path = `${project.sourceRoot}/${projectType}`;
    }

    const parsedPath = parseName(_options.path, _options.name);
    _options.name = parsedPath.name;
    _options.path = parsedPath.path;

    // Parse template files
    const templateSource = apply(url('./files'), [
      renameTemplateFiles(),
      template({
        ...strings,
        ..._options,
        gerarListEntidades: gerarListEntidades,
        gerarCampos: gerarCampos,
        alimentarFormulario: alimentarFormulario,
        showDataTable:showDataTable,
        showColunasDataTable:showColunasDataTable,
        classify: strings.classify,
        dasherize: strings.dasherize
      }),
      move(normalize((_options.path + '/' + _options.name) as string))
    ]);

    // Return Rule chain
    return chain([branchAndMerge(chain([mergeWith(templateSource)]))])(
      tree,
      context
    );
  };
}

export function parseName(
  path: string,
  name: string
): { name: string; path: Path } {
  const nameWithoutPath = basename(name as Path);
  const namePath = dirname((path + '/' + name) as Path);

  return {
    name: nameWithoutPath,
    path: normalize('/' + namePath)
  };
}

export function testezada()
{
  var aux;
  aux=5+10;
  return aux;
}