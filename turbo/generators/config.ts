import { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("example", {
    description:
      "An example Turborepo generator - creates a new file at the root of the project",
    prompts: [
      {
        type: "input",
        name: "file",
        message: "What is the name of the new file to create?",
        validate: (input: string) => {
          if (input.includes(".")) {
            return "file name cannot include an extension";
          }
          if (input.includes(" ")) {
            return "file name cannot include spaces";
          }
          if (!input) {
            return "file name is required";
          }
          return true;
        }
      },
      {
        type: "list",
        name: "type",
        message: "What type of file should be created?",
        choices: [".md", ".txt"]
      },
      {
        type: "input",
        name: "title",
        message: "What should be the title of the new file?"
      }
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/{{ dashCase file }}{{ type }}",
        templateFile: "templates/turborepo-generators.hbs"
      }
    ]
  });

  plop.setGenerator("seguridad",{
    description: "Generator para crear los archivos de seguridad",
    prompts:[
      {
        type: 'input',
        name: 'appName',
        message: '¿Cómo se llama la app a la que se le agregarán los módulos de seguridad?',
        validate: (input: string) => {
          if (input.includes(".")) {
            return "La app no puede llevar extensiones en su nombre";
          }
          if (input.includes(" ")) {
            return "La app no puede llevar espacios en su nombre";
          }
          if (!input) {
            return "Se necesita el nombre de la app";
          }
          return true;
        }
      }
    ],
    actions: [
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/page.tsx",
        templateFile: 'templates/seguridad/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app/dashboard/seguridad/usuarios/page.tsx",
        templateFile: 'templates/seguridad/usuarios/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/usuarios/editar/id/page.tsx",
        templateFile: 'templates/seguridad/usuarios/editar/id/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/permisos/page.tsx",
        templateFile: 'templates/seguridad/permisos/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/permisos/crear/page.tsx",
        templateFile: 'templates/seguridad/permisos/crear/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/permisos/editar/id//page.tsx",
        templateFile: 'templates/seguridad/permisos/editar/id/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/perfiles/page.tsx",
        templateFile: 'templates/seguridad/perfiles/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/perfiles/crear/page.tsx",
        templateFile: 'templates/seguridad/perfiles/crear/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/perfiles/editar/id//page.tsx",
        templateFile: 'templates/seguridad/perfiles/editar/id/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/perfiles/asignacion-permisos/id/page.tsx",
        templateFile: 'templates/seguridad/perfiles/asignacion-permisos/id/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/modulos/page.tsx",
        templateFile: 'templates/seguridad/modulos/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/modulos/crear/page.tsx",
        templateFile: 'templates/seguridad/modulos/crear/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/modulos/editar/id//page.tsx",
        templateFile: 'templates/seguridad/modulos/editar/id/page.hbs'
      },
      {
        type: "add",
        path: "{{ turbo.paths.root }}/apps/{{ dashCase appName }}/src/app//dashboard/seguridad/logos/page.tsx",
        templateFile: 'templates/seguridad/logos/page.hbs'
      },
    ]
  })
}
