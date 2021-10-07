<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-center">
        <v-col cols="12" class="text-center">
          <p id="hero-text" class="text-h4 text-md-h1 mb-0 font-weight-black">
            Improve your Computer Science results.
          </p>
        </v-col>
        <v-col cols="12" md="7">
          <p class="sub-hero text-center mb-8">
            Most learning tools focus on multiple-choice and gap fills. Examgap
            is a powerful yet simple system for practising
            <span class="highlight">written answer</span> exam questions.
          </p>
          <div class="d-flex justify-center">
            <v-btn x-large color="yell" rounded elevation="0" nuxt to="/trial">
              <span class="heading--text">Get a 30-day free trial</span>
            </v-btn>
          </div>
          <div class="d-flex justify-center mt-4">
            <small>
              <i class="fa-regular fa-circle-check ico-blue"></i>
              No payment info
              <i class="fa-regular fa-circle-check ico-blue ml-2"></i>
              Improve your results
            </small>
          </div>
        </v-col>
      </v-row>
      <svg
        version="1.1"
        class="svg-filters"
        style="position: absolute; height: 0"
      >
        <defs>
          <filter id="marker-shape">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0 0.12"
              numOctaves="1"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="30"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
        </defs>
      </svg>
    </v-container>
    <v-container id="why">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12" md="6" class="pad-r">
          <p class="text-h5 text-md-h4 font-weight-bold">
            Mark more efficiently
          </p>
          <p class="text-body-1">
            Examgap makes marking more efficient. See responses side-by-side
            with the mark scheme—tick to award marks. Optionally, leave feedback
            so students know how to improve.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/mark.png" alt="Marking" eager></v-img>
        </v-col>
      </v-row>
      <v-row
        class="d-flex align-center justify-center flex-md-row-reverse pad-vert"
      >
        <v-col cols="12" md="6" class="pad-l">
          <p class="text-h5 text-md-h4 font-weight-bold">
            Diagnose strengths & weaknesses
          </p>
          <p class="text-body-1">
            Marks are automatically recorded in a detailed grade
            book—colour-coded against target grades. This helps you monitor
            progress to target intervention more effectively.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/grades.png" alt="Grades" eager></v-img>
        </v-col>
      </v-row>
      <v-row class="d-flex align-center justify-center pad-vert">
        <v-col cols="12" md="6" class="pad-r">
          <p class="text-h5 text-md-h4 font-weight-bold">
            Differentiation is built in
          </p>
          <p class="text-body-1">
            When you create an assignment, all students start in exam mode. You
            can quickly differentiate by turning off exam mode. When exam mode
            is off, students see keywords and a minimum word count when
            answering questions.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/diff.png" alt="Differentiation" eager></v-img>
        </v-col>
      </v-row>
      <v-row
        class="d-flex align-center justify-center flex-md-row-reverse pad-vert"
      >
        <v-col cols="12" md="6" class="pad-l">
          <p class="text-h5 text-md-h4 font-weight-bold">
            Independent revision
          </p>
          <p class="text-body-1">
            Students can use Examgap for independent revision with no teacher
            intervention. Supplement paper-based revision guides with essential
            exam practise.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/revision.png" alt="Independent revision eager"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <!-- Testamonials -->
    <v-container fluid>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10" lg="9">
          <p class="text-h5 text-md-h4 font-weight-bold text-center">
            What teachers say&hellip;
          </p>
          <div class="d-flex justify-center">
            <img src="/zap2.svg" width="60%" alt="" />
          </div>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col
          cols="12"
          md="6"
          class="d-flex justify-center align-center testamonial pa-md-10"
        >
          <div class="text-center">
            <p class="text-h6">
              "Examgap supports my teaching at GCSE. It's especially good for
              high achievers."
            </p>
            <p>
              <span class="font-weight-medium">Alan</span>&mdash;<i
                >Chauncy School, The Ware Academy for Visual Arts, Mathematics
                &amp; Computing
              </i>
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col
          cols="12"
          md="6"
          class="
            testamonial
            d-flex
            justify-center
            align-center
            justify-center
            pa-md-10
          "
        >
          <div class="text-center">
            <p class="text-h6">
              "Students found Examgap really helped structure answers. Immediate
              feedback, combined with comparing self-assessment to the teacher's
              assessment allowed students to identify mistakes when writing
              answers."
            </p>
            <p>
              <span class="font-weight-medium">Andy</span>&mdash;<i
                >The Hertfordshire &amp; Essex High School and Science
                College</i
              >
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col
          cols="12"
          md="6"
          class="d-flex justify-center align-center testamonial pa-md-10"
        >
          <div class="text-center">
            <p class="text-h6">
              "[The Examgap process], done regularly, creates a cycle of
              continuous improvement and can lead to better exam results."
            </p>
            <p>
              <span class="font-weight-medium">Grace</span>&mdash;<i
                >St. Mary's CE High School</i
              >
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- How it works -->
    <div id="how">
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center pb-0">
            <p id="how-text" class="text-h4 text-md-h2">
              <span class="illum">H</span>ow does it work?
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container id="how-cont">
      <v-row class="justify-center">
        <v-col cols="12">
          <v-card rounded="lg" elevation="6" class="pa-6">
            <v-container>
              <v-row>
                <v-col cols="12" md="4">
                  <div class="d-flex justify-center">
                    <i class="fa-light fa-circle-1 ico-blue fa-4x centre"></i>
                  </div>
                  <p class="text-h6 text-center mt-4">Choose questions</p>
                  <p class="text-center">
                    Choose questions organised by syllabus topic. All questions
                    are course and board specific—so you know they'll be
                    relevant.
                  </p>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="d-flex justify-center">
                    <i class="fa-light fa-circle-2 ico-blue fa-4x centre"></i>
                  </div>
                  <p class="text-h6 text-center mt-4">Set assignments</p>
                  <p class="text-center">
                    Set assignments for the whole class or just selected
                    students. Use in class or as homework/revision.
                  </p>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="d-flex justify-center">
                    <i class="fa-light fa-circle-3 ico-blue fa-4x centre"></i>
                  </div>
                  <p class="text-h6 text-center mt-4">Mark and feedback</p>
                  <p class="text-center">
                    Mark and feedback quickly with features designed to making
                    marking efficient and pain free.
                  </p>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container id="boards">
      <v-row>
        <v-col cols="12">
          <p class="text-h5 text-md-h4 text-center font-weight-bold">
            GCSE and A level Computer Science courses
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="4">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th colspan="2" class="text-overline">IGCSE Courses</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="font-weight-bold">Cambridge Assessment</span>
                    <span class="text-caption">(0984)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">Pearson Edexcel</span>
                    <span class="text-caption">(4CP0)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col cols="12" md="4">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th colspan="2" class="text-overline">GCSE Courses</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="font-weight-bold">AQA</span>
                    <span class="text-caption">(8520)</span>
                  </td>
                  <td class="text-center">
                    <i class="fa-regular fa-check ico-green fa-xl"></i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">AQA</span>
                    <span class="text-caption">(8525)</span>
                    <v-chip color="primary" class="ml-2" outlined small label
                      >NEW</v-chip
                    >
                  </td>
                  <td class="text-center">
                    <i class="fa-regular fa-check ico-green fa-xl"></i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">OCR</span>
                    <span class="text-caption">(J276)</span>
                  </td>
                  <td class="text-center">
                    <i class="fa-regular fa-check ico-green fa-xl"></i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">OCR</span>
                    <span class="text-caption">(J277)</span>
                    <v-chip color="primary" class="ml-2" outlined small label
                      >NEW</v-chip
                    >
                  </td>
                  <td class="text-center">
                    <i class="fa-regular fa-check ico-green fa-xl"></i>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">Pearson Edexcel</span>
                    <span class="text-caption">(1CP2)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">WJEC Eduqas</span>
                    <span class="text-caption">(C500QS)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
        <v-col cols="12" md="4">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th colspan="2" class="text-overline">A Level Courses</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="font-weight-bold">AQA</span>
                    <span class="text-caption">(7517)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">OCR</span>
                    <span class="text-caption">(H446)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">WJEC Eduqas</span>
                    <span class="text-caption">(A500QS)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">Cambridge Assessment</span>
                    <span class="text-caption">(9618)</span>
                  </td>
                  <td class="text-center">
                    <v-chip outlined small label>SOON</v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
    <v-container id="try" fluid>
      <v-row class="d-flex justify-center text-center">
        <v-col class="12" md="8">
          <p
            class="
              text-h5 text-md-h4
              font-weight-bold
              white--text
              text-center
              mb-8
            "
          >
            Try Examgap free in your department
          </p>
          <v-btn x-large color="yell" rounded elevation="0" nuxt to="/trial">
            <span class="heading--text">Get a 30-day free trial</span>
          </v-btn>
          <div class="mt-4 white--text d-flex justify-center">
            <small>
              <i class="fa-regular fa-circle-check ico-light-pink"></i>
              No payment info
              <i class="fa-regular fa-circle-check ico-light-pink ml-2"></i>
              Set up in minutes
            </small>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- Research -->
    <v-container id="research">
      <v-row>
        <v-col cols="12">
          <p class="text-h5 text-md-h4 font-weight-bold text-center">
            Backed by research
          </p>
          <div class="d-flex justify-center">
            <img src="/zap.svg" width="60%" alt="" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="6"
          class="d-flex align-center justify-center quote pa-md-10"
        >
          <div>
            <p class="text-h6 text-center">
              "There is clear evidence that . . . assessment can have a positive
              impact on learning and teaching."<sup>*</sup>
            </p>
          </div>
        </v-col>
        <v-col
          cols="6"
          class="d-flex align-center justify-center quote pa-md-10"
        >
          <div>
            <p class="text-h6 text-center">
              "Use of low stakes testing can contribute to learning in valuable
              ways."<sup>*</sup>
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6" class="d-flex align-center pa-md-10 quote">
          <div>
            <p class="text-h6 text-center">
              "Teachers can use assessment to help them plan lessons, adapt
              lessons to measured gaps in knowledge and skills, and if necessary
              re-teach."<sup>*</sup>
            </p>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-flex align-center pa-md-10 testamonial quote"
        >
          <div>
            <p class="text-h6 text-center">
              "Learners who take a test shortly after studying . . . do better
              on a final test than those who do not."<sup>*</sup>
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <p class="text-caption text-center">
            <sup>*</sup>Ofsted 2019, Education inspection framework: Overview of
            research
          </p>
        </v-col>
      </v-row>
    </v-container>
    <!-- Feature for teachers -->
    <div id="what">
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center">
            <p class="text-h5 text-md-h4 text-xl">
              <span class="illum2">T</span>houghtful features
            </p>
          </v-col>
        </v-row>
        <v-row class="heading--text">
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-center flex-column align-center"
          >
            <i class="fa-regular fa-ear-listen fa-3x mb-4"></i>
            <p class="font-weight-bold text-center">Audio descriptions</p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-center flex-column align-center"
          >
            <i class="fa-regular fa-traffic-light fa-3x mb-4"></i>
            <p class="font-weight-bold">Smart colour coding</p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-center flex-column align-center"
          >
            <i class="fa-regular fa-comment-lines fa-3x mb-4"></i>
            <p class="font-weight-bold">Comment bank</p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-center flex-column align-center"
          >
            <i class="fa-regular fa-bullseye-arrow fa-3x mb-4"></i>
            <p class="font-weight-bold">Target setting</p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-center flex-column align-center"
          >
            <i class="fa-regular fa-arrow-down-to-line fa-3x mb-4"></i>
            <p class="font-weight-bold">Export data</p>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="4"
            class="d-flex justify-center flex-column align-center"
          >
            <i class="fa-regular fa-arrows-repeat fa-3x mb-4"></i>
            <p class="font-weight-bold">Reassign questions</p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- About -->
    <v-container id="written">
      <v-row>
        <v-col>
          <p class="text-h5 text-md-h4 text-center text-xl">
            Why focus on
            <span class="highlight">written answer</span> questions?
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center flex-md-row-reverse">
        <v-col cols="12" md="3">
          <v-img id="owen" src="/owen.jpg" alt="Portrait of Owen" eager></v-img>
        </v-col>
        <v-col cols="12" md="5" class="text-body-1">
          <p>
            Hi—I’m Owen. I've been a teacher for over fourteen years. I created
            Examgap to use in my department.
          </p>
          <p>
            We all know students need to practise exam-style questions. Yet most
            websites focus on multiple choice and gap fills. But GCSE papers
            aren’t multiple choice†. Therefore,
            <span class="font-weight-medium"
              >it’s essential students practise written answer questions in
              order to do well.</span
            >
          </p>
          <p>
            Frequent testing with existing question banks is a hassle. You have
            to print and photocopy the questions, mark them by hand and
            painstakingly transcribe the results into a spreadsheet. Examgap
            streamlines this process with:
          </p>
          <ul class="mb-4">
            <li>Tick-box marking</li>
            <li>Automated comment bank</li>
            <li>Detailed grade book</li>
          </ul>
          <p>
            If you’re a Computing teacher,
            <nuxt-link to="/trial">try it for free</nuxt-link>. No payment
            information needed.
          </p>
          <p>
            If you have any questions, get in touch—<a
              href="mailto:owen@examgap.com"
              >owen@examgap.com</a
            >.
          </p>
          <p>&mdash;Cheers, Owen</p>
          <v-divider />
          <p class="text-caption">
            † A typical Computer Science paper is only about 13% closed
            questions.
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-container id="featured">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="3">
          <p class="text-center text-caption">Featured in</p>
          <v-img src="/riomheolas.png" alt="Re na Riomheolas logo"></v-img>
          <p class="text-center text-caption">
            THE COMPUTER SCIENCE TEACHERS’ ASSOCIATION OF IRELAND
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default { layout: 'static' }
</script>

<style scoped>
/* ######### Hero ######### */

#hero-text {
  color: #002e3e;
  line-height: 1.25em;
  padding-top: 0.6em;
}

/* increase padding on desktop */
@media only screen and (min-width: 960px) {
  #hero-text {
    padding-top: 1em;
    font-size: 4.5em !important;
  }
}

.sub-hero {
  font-size: 1.4em !important;
  letter-spacing: 0.0125em;
}

/* reduce font size on mobile */
@media only screen and (max-width: 600px) {
  .sub-hero {
    font-size: 1.125em !important;
  }
}

/* ####### Why use? ####### */

#why {
  margin-top: 3em;
  margin-bottom: 3em;
}

/* add space between screenshots */
.pad-vert {
  padding-top: 1em;
  padding-bottom: 1em;
}

@media only screen and (min-width: 960px) {
  .pad-vert {
    padding-top: 3em;
    padding-bottom: 3em;
  }
}

/* more whitespace on desktop */
@media only screen and (min-width: 600px) {
  .pad-l {
    padding-left: 7em;
  }
  .pad-r {
    padding-right: 7em;
  }
}

/* ##### Testamonials ##### */

.testamonial {
  height: 250px;
}
@media only screen and (max-width: 600px) {
  .testamonial {
    margin-top: 2em;
    margin-bottom: 2em;
  }
}

.quote {
  height: 200px;
}

/* ####### How works ###### */

#how {
  background-color: #0099cc !important;
  padding-top: 4em;
  padding-bottom: 6em;
}

#how-text {
  color: #f1f3f8;
  line-height: 1.375em;
  font-weight: 800;
}

/* move cards up to overlap */
#how-cont {
  position: relative;
  top: -5em;
}

/* ######## Boards ######## */
#boards {
  padding-top: 3em;
  padding-bottom: 3em;
}

/* reduce spacing on mobile */
@media only screen and (max-width: 600px) {
  #boards {
    padding-top: 2em;
    padding-bottom: 5em;
  }
}

/* ######### Try ########## */

#try {
  background-color: #0099cc;
  margin-top: 4em;
  margin-bottom: 4em;
  padding-top: 4em;
  padding-bottom: 4em;
}

/* ####### Research ####### */

#research {
  padding-top: 3em;
  padding-bottom: 6em;
}

/* #### Feat. for teach ### */

#what {
  background-color: #f9b9b7;
  padding-top: 3em;
  padding-bottom: 4em;
}

/* ######### Misc ######### */
.text-xl {
  color: #001f2a;
  line-height: 1.375em;
  font-weight: bold;
}

.highlight {
  position: relative;
  white-space: nowrap;
}
.highlight:before {
  content: '';
  width: 108%;
  background-color: #0099cc;
  opacity: 0.3;
  height: 1.125em;
  position: absolute;
  filter: url(#marker-shape);
  left: -0.25em;
  top: 0.1em;
  padding: 0 0.25em;
  transform: rotate(-1deg);
}

.highlighty {
  position: relative;
  white-space: nowrap;
}
.highlighty:before {
  content: '';
  width: 108%;
  background-color: #f4d06f;
  opacity: 0.3;
  height: 1.125em;
  position: absolute;
  filter: url(#marker-shape);
  left: -0.25em;
  top: 0.1em;
  padding: 0 0.25em;
  transform: rotate(-1deg);
}

.illum {
  border-bottom: 6px solid #f9b9b7;
}

.illum2 {
  border-bottom: 6px solid #0099cc;
}

/* ######### Owen ######### */

#written {
  padding-top: 6em;
  padding-bottom: 3em;
}

#owen {
  border-radius: 50%;
}

/* ###### Riomhheolas ##### */
#featured {
  padding-top: 3em;
  padding-bottom: 3em;
}

.centre {
  margin-left: auto;
  margin-right: auto;
}
</style>
