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
        <br />

        <v-tabs2
          v-if="scope.data.resume"
          direction="vertical"
          :tabs="{
            basics: `Contato`,
            work: `Experiência (${scope.data.resume.work.length})`,
            volunteer: `Voluntariado (${scope.data.resume.volunteer.length})`,
            education: `Formação (${scope.data.resume.education.length})`,
            awards: `Prêmios (${scope.data.resume.awards.length})`,
            certificates: `Certificados (${scope.data.resume.certificates.length})`,
            publications: `Publicações (${scope.data.resume.publications.length})`,
            skills: `Habilidades (${scope.data.resume.skills.length})`,
            languages: `Idiomas (${scope.data.resume.languages.length})`,
            interests: `Interesses (${scope.data.resume.interests.length})`,
            references: `Referências (${scope.data.resume.references.length})`,
            projects: `Projetos (${scope.data.resume.projects.length})`,
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

            <br />
            <app-resume-profile-section
              name="Profiles"
              title-field="network"
              v-model="scope.data.resume.basics.profiles"
              :default="{ network: null, username: null, url: null }"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="6">
                    <v-form-input-text
                      v-model="ctx.item.network"
                      label="Network (Ex.: Twitter, Instagram, Website)"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-form-input-text
                      v-model="ctx.item.username"
                      label="Username"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      v-model="ctx.item.url"
                      label="URL"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
          </template>

          <template #tab:work>
            <app-resume-profile-section
              name="Experiencia"
              :title-field="(o) => `${o.position || '--'} em ${o.name || '--'}`"
              v-model="scope.data.resume.work"
              :default="{
                name: '',
                position: '',
                url: '',
                startDate: '',
                endDate: '',
                summary: '',
                highlights: [],
                meta: {
                  summaryShort: '',
                },
              }"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Nome"
                      v-model="ctx.item.name"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Cargo"
                      v-model="ctx.item.position"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="URL"
                      v-model="ctx.item.url"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-form-input-date
                      label="Data de início"
                      v-model="ctx.item.startDate"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-form-input-date
                      label="Data de fim"
                      v-model="ctx.item.endDate"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-textarea
                      label="Descrição"
                      v-model="ctx.item.summary"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-tags
                      label="Destaques"
                      v-model="ctx.item.highlights"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.work }}</pre> -->
          </template>

          <template #tab:volunteer>
            <app-resume-profile-section
              name="Voluntariado"
              :title-field="
                (o) => `${o.position || '--'} em ${o.organization || '--'}`
              "
              v-model="scope.data.resume.volunteer"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Organização"
                      v-model="ctx.item.organization"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Cargo"
                      v-model="ctx.item.position"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="URL"
                      v-model="ctx.item.url"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-form-input-date
                      label="Data de início"
                      v-model="ctx.item.startDate"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-form-input-date
                      label="Data de fim"
                      v-model="ctx.item.endDate"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-tags
                      label="Destaques"
                      v-model="ctx.item.highlights"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.volunteer }}</pre> -->
          </template>

          <template #tab:education>
            <app-resume-profile-section
              name="Formação"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.education"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="URL"
                      v-model="ctx.item.url"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Curso"
                      v-model="ctx.item.area"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Grau de instrução"
                      hint="Técnico, Bacharel, Mestrado, Doutorado, etc"
                      v-model="ctx.item.studyType"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-form-input-date
                      label="Data de início"
                      v-model="ctx.item.startDate"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-form-input-date
                      label="Data de fim"
                      v-model="ctx.item.endDate"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
          </template>

          <template #tab:awards>
            <app-resume-profile-section
              name="Prêmios"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.awards"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Título"
                      v-model="ctx.item.title"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-form-input-date
                      label="Data"
                      v-model="ctx.item.date"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-form-input-text
                      label="Instituição que premiou"
                      v-model="ctx.item.awarder"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-textarea
                      label="Descrição"
                      v-model="ctx.item.summary"
                      hide-details="auto"
                      auto-grow
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.awards }}</pre> -->
          </template>

          <template #tab:certificates>
            <app-resume-profile-section
              name="Certificados"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.certificates"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Nome"
                      v-model="ctx.item.name"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-date
                      label="Data"
                      v-model="ctx.item.date"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Emissora"
                      v-model="ctx.item.issuer"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-form-input-text
                      label="URL"
                      v-model="ctx.item.url"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.certificates }}</pre> -->
          </template>

          <template #tab:publications>
            <app-resume-profile-section
              name="Publicações"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.publications"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.publications }}</pre> -->
          </template>

          <template #tab:skills>
            <app-resume-profile-section
              name="Habilidades"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.skills"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.skills }}</pre> -->
          </template>

          <template #tab:languages>
            <app-resume-profile-section
              name="Idiomas"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.languages"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.languages }}</pre> -->
          </template>

          <template #tab:interests>
            <app-resume-profile-section
              name="Interesses"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.interests"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.interests }}</pre> -->
          </template>

          <template #tab:references>
            <app-resume-profile-section
              name="Referências"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.references"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.references }}</pre> -->
          </template>

          <template #tab:projects>
            <app-resume-profile-section
              name="Projetos"
              :title-field="(o) => o.meta.uuid"
              v-model="scope.data.resume.projects"
              :default="{}"
            >
              <template #item="ctx">
                <v-row>
                  <v-col cols="12">
                    <v-form-input-text
                      label="Instituição"
                      v-model="ctx.item.institution"
                      hide-details="auto"
                    />
                  </v-col>
                </v-row>
              </template>
            </app-resume-profile-section>
            <!-- <pre>{{ scope.data.resume.projects }}</pre> -->
          </template>
        </v-tabs2>
        <br />
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
import _ from "lodash";

const onEditInit = (scope) => {
  if (typeof scope.data.resume != "object" || scope.data.resume === null) {
    scope.data.resume = {};
  }

  scope.data.resume = _.merge(
    {
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
        //   name: "Company",
        //   position: "President",
        //   url: "https://company.com",
        //   startDate: "2013-01-01",
        //   endDate: "2014-01-01",
        //   summary: "Description…",
        //   highlights: ["Started the company"],
        // },
      ],
      volunteer: [
        // {
        //   organization: "Organization",
        //   position: "Volunteer",
        //   url: "https://organization.com/",
        //   startDate: "2012-01-01",
        //   endDate: "2013-01-01",
        //   summary: "Description…",
        //   highlights: ["Awarded 'Volunteer of the Month'"],
        // },
      ],
      education: [
        // {
        //   institution: "University",
        //   url: "https://institution.com/",
        //   area: "Software Development",
        //   studyType: "Bachelor",
        //   startDate: "2011-01-01",
        //   endDate: "2013-01-01",
        //   score: "4.0",
        //   courses: ["DB1101 - Basic SQL"],
        // },
      ],
      awards: [
        // {
        //   title: "Award",
        //   date: "2014-11-01",
        //   awarder: "Company",
        //   summary: "There is no spoon.",
        // },
      ],
      certificates: [
        // {
        //   name: "Certificate",
        //   date: "2021-11-07",
        //   issuer: "Company",
        //   url: "https://certificate.com",
        // },
      ],
      publications: [
        // {
        //   name: "Publication",
        //   publisher: "Company",
        //   releaseDate: "2014-10-01",
        //   url: "https://publication.com",
        //   summary: "Description…",
        // },
      ],
      skills: [
        // {
        //   name: "Web Development",
        //   level: "Master",
        //   keywords: ["HTML", "CSS", "JavaScript"],
        // },
      ],
      languages: [
        // {
        //   language: "English",
        //   fluency: "Native speaker",
        // },
      ],
      interests: [
        // {
        //   name: "Wildlife",
        //   keywords: ["Ferrets", "Unicorns"],
        // },
      ],
      references: [
        // {
        //   name: "Jane Doe",
        //   reference: "Reference…",
        // },
      ],
      projects: [
        // {
        //   name: "Project",
        //   startDate: "2019-01-01",
        //   endDate: "2021-01-01",
        //   description: "Description...",
        //   highlights: ["Won award at AIHacks 2016"],
        //   url: "https://project.com/",
        // },
      ],
    },
    scope.data.resume
  );
};
</script>
