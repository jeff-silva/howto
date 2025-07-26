<template>
  <nuxt-layout name="main">
    <v-page-view :query="{ view: undefined }">
      <v-form-actions
        :actions="[
          { text: 'Novo', color: 'primary', to: { query: { view: 'edit' } } },
        ]"
      />
      <v-entity-search
        entity="resume_profile"
        :headers="[{ key: 'name', title: 'Nome' }]"
        :actions="
          (scope) => [
            {
              text: 'Nome',
              icon: 'mdi-pen',
              to: `/admin/resume_profile?view=edit&id=${scope.item.id}`,
            },
          ]
        "
      />
    </v-page-view>

    <v-page-view :query="{ view: 'edit' }">
      <v-entity-edit
        entity="resume_profile"
        #default="scope"
        @init="onEditInit"
      >
        <v-form-field label="Nome do Perfil">
          <v-form-input-text v-model="scope.data.name" />
        </v-form-field>

        <v-tabs2
          v-if="scope.data.resume"
          direction="vertical"
          :tabs="{
            basics: 'Contato',
            work: 'Experiência',
            volunteer: 'Voluntariado',
            education: 'Educação',
            awards: 'Prêmios',
            certificates: 'Certificados',
            publications: 'Publicações',
            skills: 'Habilidades',
            languages: 'Idiomas',
            interests: 'Interesses',
            references: 'Referências',
            projects: 'Projetos',
          }"
        >
          <template #tab:basics>
            <v-form-field
              label="Nome"
              :block="true"
            >
              <v-form-input-text v-model="scope.data.resume.basics.name" />
            </v-form-field>
            <v-form-field
              label="Resumo skills"
              :block="true"
            >
              <v-form-input-text v-model="scope.data.resume.basics.label" />
            </v-form-field>
            <v-form-field
              label="Foto"
              :block="true"
            >
            </v-form-field>
            <v-form-field
              label="E-mail"
              :block="true"
            >
              <v-form-input-text v-model="scope.data.resume.basics.email" />
            </v-form-field>
            <v-form-field
              label="Telefone"
              :block="true"
            >
              <v-form-input-text v-model="scope.data.resume.basics.phone" />
            </v-form-field>
            <v-form-field
              label="URL"
              :block="true"
            >
              <v-form-input-text v-model="scope.data.resume.basics.url" />
            </v-form-field>
            <v-form-field
              label="Descrição"
              :block="true"
            >
              <v-form-input-textarea
                auto-grow
                v-model="scope.data.resume.basics.summary"
              />
            </v-form-field>
            <!-- <pre>{{ scope.data.resume.basics }}</pre> -->
          </template>
          <template #tab:work>
            <pre>{{ scope.data.resume.work }}</pre>
          </template>
          <template #tab:volunteer>
            <pre>{{ scope.data.resume.volunteer }}</pre>
          </template>
          <template #tab:education>
            <pre>{{ scope.data.resume.education }}</pre>
          </template>
          <template #tab:awards>
            <pre>{{ scope.data.resume.awards }}</pre>
          </template>
          <template #tab:certificates>
            <pre>{{ scope.data.resume.certificates }}</pre>
          </template>
          <template #tab:publications>
            <pre>{{ scope.data.resume.publications }}</pre>
          </template>
          <template #tab:skills>
            <pre>{{ scope.data.resume.skills }}</pre>
          </template>
          <template #tab:languages>
            <pre>{{ scope.data.resume.languages }}</pre>
          </template>
          <template #tab:interests>
            <pre>{{ scope.data.resume.interests }}</pre>
          </template>
          <template #tab:references>
            <pre>{{ scope.data.resume.references }}</pre>
          </template>
          <template #tab:projects>
            <pre>{{ scope.data.resume.projects }}</pre>
          </template>
        </v-tabs2>
        <v-form-actions
          :actions="[
            { text: 'Cancelar', to: { query: {} } },
            {
              text: 'Salvar',
              color: 'primary',
              type: 'submit',
              loading: scope.save.busy,
            },
          ]"
        />
      </v-entity-edit>
    </v-page-view>
  </nuxt-layout>
</template>

<script setup>
const onEditInit = (scope) => {
  if (typeof scope.data.resume != "object" || scope.data.resume === null) {
    scope.data.resume = {};
  }

  scope.data.resume = {
    $schema:
      "https://raw.githubusercontent.com/jsonresume/resume-schema/refs/heads/v1.0.0/schema.json",
    meta: {
      version: "v1.0.0",
      canonical:
        "https://github.com/jsonresume/resume-schema/blob/v1.0.0/schema.json",
      updatedAt: {
        date: "2023-12-06T14:20:14-03:00",
        formatted: "Dec 2023",
      },
    },
    basics: {
      name: scope.data.name || "",
      label: "",
      image: "",
      email: "",
      phone: "",
      url: "",
      summary: "",
      location: {
        address: "",
        postalCode: "",
        city: "",
        region: "",
        countryCode: "",
      },
      profiles: [
        // {
        //   network: "Website",
        //   username: "jeff-silva",
        //   url: "https://jeff-silva.github.io/",
        // },
      ],
    },
    work: [
      // {
      //   institution: "",
      //   area: "",
      //   studyType: "",
      //   score: "",
      //   courses: [],
      //   name: "",
      //   position: "",
      //   url: "",
      //   summary: "",
      //   startDate: "",
      //   endDate: "",
      //   meta: {
      //     summaryShort: "",
      //   },
      // },
    ],
    volunteer: [],
    education: [
      // {
      //   institution: "WebBH Escola de Informática",
      //   area: "Desenvolvimento Web",
      //   studyType: "Ensino Técnico",
      //   score: "",
      //   courses: [
      //     "PHP",
      //     "MySQL",
      //     "SQL Server",
      //     "CSS",
      //     "Javascript",
      //     "HTML5",
      //     "Tableless",
      //     "Action script",
      //   ],
      //   startDate: "2009-03-31",
      //   endDate: "2010-09-30",
      // },
    ],
    awards: [],
    certificates: [],
    publications: [],
    skills: [
      // {
      //   name: "Vue 3",
      //   level: "",
      //   keywords: ["Frontend", "Main Stack"],
      // },
    ],
    languages: [
      // {
      //   language: "Português Brasileiro",
      //   fluency: "Nativo",
      // },
    ],
    interests: [],
    references: [],
    projects: [
      // {
      //   name: "Corapost",
      //   description: '',
      //   highlights: ["Labscript.dev"],
      //   meta: {
      //     images: [],
      //   },
      //   url: "https://corapost.com",
      //   startDate: "2024-07-01",
      //   endDate: "2024-04-30",
      //   meta: {
      //     images: [
      //       {
      //         file: "https://jeff-silva.github.io/jeff-silva/assets/projects/blog-banco-da-amazonia.jpg",
      //         name: "",
      //       },
      //     ],
      //   },
      // },
    ],
    ...scope.data.resume,
  };

  console.log({ scope });
};
</script>
