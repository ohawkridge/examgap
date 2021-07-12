<template>
  <v-main>
    <v-container>
      <v-row class="d-flex justify-center">
        <v-col cols="12" class="text-center">
          <p id="hero-text" class="text-h4 text-md-h2 mb-0">
            Improve your Computer Science results.
          </p>
        </v-col>
        <v-col cols="12" md="7">
          <p class="summary text-center mb-8">
            Most learning tools focus on multiple-choice and gap fills. Examgap
            is a powerful yet simple system for practising
            <span class="highlight">written answer</span> exam questions.
          </p>
          <div class="d-flex justify-center">
            <v-btn x-large color="primary" elevation="0" nuxt to="/trial">
              Get a 30-day free trial
            </v-btn>
          </div>
          <div class="d-flex justify-center mt-4">
            <small>
              <v-icon small color="secondary">{{
                $icons.mdiCheckboxMarkedCircleOutline
              }}</v-icon>
              No payment info
              <v-icon small color="secondary" class="ml-2">{{
                $icons.mdiCheckboxMarkedCircleOutline
              }}</v-icon>
              Set up in minutes
            </small>
          </div>
        </v-col>
      </v-row>
      <svg version="1.1" class="d-none svg-filters">
        <defs>
          <filter id="marker-shape">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0 0.15"
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
            Spend less time marking
          </p>
          <p class="text-body-1">
            Examgap makes marking more efficient. See responses side-by-side
            with the mark scheme—tick to award marks. Optionally, leave feedback
            so students know how to improve.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/mark.png" alt="Marking"></v-img>
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
            Marks are automatically recorded in a detailed grade book. This
            helps you monitor progress to target intervention more effectively.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/grades.png" alt="Grades"></v-img>
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
          <v-img src="/diff.png" alt="Differentiation"></v-img>
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
            Students can use Examgap for unlimited independent revision. It
            makes a great supplement to paper-based revision guides and needs no
            intervention from you.
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="/revision.png" alt="Independent revision"></v-img>
        </v-col>
      </v-row>
    </v-container>
    <!-- Testamonials -->
    <v-container fluid>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="9">
          <p class="text-h5 font-weight-bold text-md-h4 text-center">
            What people say&hellip;
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="6"
          class="d-flex align-center testamonial border-top-bottom pa-md-10"
        >
          <div>
            <p class="text-h6 text-center">
              "Examgap supports my teaching at GCSE. It's especially good for
              high achievers."
            </p>
            <p class="text-body-1 text-center">
              <span class="font-weight-medium">Alan</span>&mdash;<i
                >Chauncy School, The Ware Academy for Visual Arts, Mathematics
                &amp; Computing
              </i>
            </p>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="
            d-flex
            align-center
            testamonial
            border-left border-top-bottom
            pa-md-10
          "
        >
          <div>
            <p class="text-h6 text-center">
              "[The Examgap process], done regularly, creates a cycle of
              continuous improvement and can lead to better exam results."
            </p>
            <p class="text-body-1 text-center">
              <span class="font-weight-medium">Grace</span>&mdash;<i
                >St. Mary's CE High School</i
              >
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          class="
            testamonial
            long-test
            d-flex
            align-center
            justify-center
            pa-md-10
          "
        >
          <div>
            <p class="text-h6 text-center">
              "Students found Examgap really helped strucure answers. Immediate
              feedback, combined with comparing self assessment to the teacher's
              assessment allowed students to identify mistakes when writing
              answers."
            </p>
            <p class="text-body-1 text-center">
              <span class="font-weight-medium">Andy</span>&mdash;<i
                >The Hertfordshire &amp; Essex High School and Science
                College</i
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
              <span class="illum">H</span>ow it works
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container id="how-cont">
      <v-row class="justify-center">
        <v-col cols="12" md="4">
          <v-card id="card1" rounded="lg" elevation="6" class="pa-6 how-card">
            <v-card-title>
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#b7d1da"
                class="mr-2"
              >
                <path :d="$icons.mdiNumeric1Circle"></path></svg
              >Browse questions
            </v-card-title>
            <v-card-text class="text-body-1">
              <p>
                Browse questions organised by syllabus topic. All questions are
                course and board specific—so you know they'll be relevant.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card id="card2" rounded="lg" elevation="6" class="pa-6 how-card">
            <v-card-title>
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#b7d1da"
                class="mr-2"
              >
                <path :d="$icons.mdiNumeric2Circle"></path>
              </svg>
              Set assignments
            </v-card-title>
            <v-card-text class="text-body-1">
              <p>
                You can set assignments for the whole class or just selected
                students. Use in class or as homework/revision.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card id="card3" rounded="lg" elevation="6" class="pa-6 how-card">
            <v-card-title>
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#b7d1da"
                class="mr-2"
              >
                <path :d="$icons.mdiNumeric3Circle"></path>
              </svg>
              Mark & feedback
            </v-card-title>
            <v-card-text class="text-body-1">
              <p>
                Mark and feedback quickly with the automatic comment bank.
                Reassign questions to students with a single click.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
          <p class="sub-hero-text text-center">
            Assessment with a <span class="highlight">positive impact</span> on
            learning and teaching
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-container id="research">
      <v-row class="d-flex justify-center mb-10">
        <v-col cols="12" md="5" class="text-body-1">
          <div class="d-flex">
            <div>
              <v-icon class="ico-bg mr-2" color="white">{{
                $icons.mdiMicroscope
              }}</v-icon>
            </div>
            "Use of low stakes testing can contribute to learning in valuable
            ways".
          </div>
        </v-col>
        <v-col cols="12" md="5" class="text-body-1">
          <div class="d-flex research-item">
            <div>
              <v-icon class="ico-bg mr-2" color="white">{{
                $icons.mdiCheck
              }}</v-icon>
            </div>
            Examgap facilitates frequent low stakes testing. It lets students
            gain confidence as they learn.
          </div>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center mb-10">
        <v-col cols="12" md="5" class="text-body-1">
          <div class="d-flex">
            <div>
              <v-icon class="ico-bg mr-2" color="white">{{
                $icons.mdiMicroscope
              }}</v-icon>
            </div>
            "Learners who take a test shortly after studying &hellip; do better
            on a final test than those who do not.
          </div>
        </v-col>
        <v-col cols="12" md="5" class="text-body-1">
          <div class="d-flex">
            <div>
              <v-icon class="ico-bg mr-2" color="white">{{
                $icons.mdiCheck
              }}</v-icon>
            </div>
            Examgap makes it easy to set exam questions for your students giving
            them more opportunities for retrieval practise.
          </div>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center mb-10">
        <v-col cols="12" md="5" class="text-body-1">
          <div class="d-flex">
            <div>
              <v-icon class="ico-bg mr-2" color="white">{{
                $icons.mdiMicroscope
              }}</v-icon>
            </div>
            "Teachers can use assessment to help them plan lessons, adapt
            lessons to measured gaps in knowledge and skills, and if necessary
            re-teach"
          </div>
        </v-col>
        <v-col cols="12" md="5" class="text-body-1">
          <div class="d-flex">
            <div>
              <v-icon class="ico-bg mr-2" color="white">{{
                $icons.mdiCheck
              }}</v-icon>
            </div>
            Examgap's detailed grade book helps inform your planning and target
            intervention effectively.
          </div>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10">
          <v-divider />
          <p class="text-caption">
            Ofsted 2019, Education inspection framework: Overview of research
          </p>
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
                    <!-- <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon> -->
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">Pearson Edexcel</span>
                    <span class="text-caption">(4CP0)</span>
                  </td>
                  <td class="text-center">
                    <!-- <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon> -->
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
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
                    <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">AQA</span>
                    <span class="text-caption">(8525)</span>
                    <v-chip label color="accent" class="ml-2" outlined small
                      >NEW</v-chip
                    >
                  </td>
                  <td class="text-center">
                    <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">OCR</span>
                    <span class="text-caption">(J276)</span>
                  </td>
                  <td class="text-center">
                    <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">OCR</span>
                    <span class="text-caption">(J277)</span>
                    <v-chip label color="accent" class="ml-2" outlined small
                      >NEW</v-chip
                    >
                  </td>
                  <td class="text-center">
                    <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">Pearson Edexcel</span>
                    <span class="text-caption">(1CP2)</span>
                    <!-- <v-chip label color="accent" class="ml-2" outlined small
                      >NEW</v-chip
                    > -->
                  </td>
                  <td class="text-center">
                    <!-- <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon> -->
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">WJEC Eduqas</span>
                    <span class="text-caption">(C500QS)</span>
                    <!-- <v-chip label color="accent" class="ml-2" outlined small
                      >NEW</v-chip
                    > -->
                  </td>
                  <td class="text-center">
                    <!-- <v-icon color="green">
                      {{ $icons.mdiCheckBold }}
                    </v-icon> -->
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
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
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">OCR</span>
                    <span class="text-caption">(H446)</span>
                  </td>
                  <td class="text-center">
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">WJEC Eduqas</span>
                    <span class="text-caption">(A500QS)</span>
                  </td>
                  <td class="text-center">
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span class="font-weight-bold">Cambridge Assessment</span>
                    <span class="text-caption">(9618)</span>
                  </td>
                  <td class="text-center">
                    <v-chip label class="ml-2" outlined small>SOON</v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
    <!-- What else you got? -->
    <div id="what">
      <v-container>
        <v-row>
          <v-col cols="12" class="d-flex align-center justify-center">
            <p id="what-text" class="text-h4 text-md-h2">
              <span class="illum">W</span>hat else you got?
            </p>
          </v-col>
        </v-row>
        <v-row class="white--text">
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <div class="mr-3">
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#fff"
              >
                <path :d="$icons.mdiTextToSpeech"></path>
              </svg>
            </div>
            <div>
              <p class="font-weight-bold">Audio Descriptions</p>
              <p class="font-weight-light">
                Automatically read every question out loud.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <div class="mr-3">
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#fff"
              >
                <path :d="$icons.mdiSortBoolDescendingVariant"></path>
              </svg>
            </div>
            <div>
              <p class="font-weight-bold">Smart Sort</p>
              <p class="font-weight-light">
                Sort mark scheme by self marks to speed up marking.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <div class="mr-3">
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#fff"
              >
                <path :d="$icons.mdiCommentTextMultipleOutline"></path>
              </svg>
            </div>
            <div>
              <p class="font-weight-bold">Comment Bank</p>
              <p class="font-weight-light">
                Built automatically for each question. Reuse comments.
              </p>
            </div></v-col
          >
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <div class="mr-3">
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#fff"
              >
                <path :d="$icons.mdiTargetAccount"></path>
              </svg>
            </div>
            <div>
              <p class="font-weight-bold">Target Setting</p>
              <p class="font-weight-light">
                See whether or not your students are on target.
              </p>
            </div></v-col
          >
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <div class="mr-3">
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#fff"
              >
                <path :d="$icons.mdiDownloadOutline"></path>
              </svg>
            </div>
            <div>
              <p class="font-weight-bold">Export Data</p>
              <p class="font-weight-light">
                Export all your student data in CSV format.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="4" class="d-flex">
            <div class="mr-3">
              <svg
                height="42"
                width="42"
                viewBox="0 0 24 24"
                role="img"
                fill="#fff"
              >
                <path :d="$icons.mdiRepeat"></path>
              </svg>
            </div>
            <div>
              <p class="font-weight-bold">Reassign Questions</p>
              <p class="font-weight-light">
                Reassign questions to students with a single click.
              </p>
            </div></v-col
          >
        </v-row>
      </v-container>
    </div>
    <!-- About -->
    <v-container id="written">
      <v-row>
        <v-col>
          <p class="sub-hero-text text-center">
            Practise <span class="highlight">written answer</span> exam
            questions online
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center flex-md-row-reverse">
        <v-col cols="12" md="3">
          <v-img id="owen" src="/owen.jpg" alt="Portrait of Owen"></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <p class="text-body-1">
            Hi—I’m Owen, a Computer Science and I.T. teacher for fourteen years.
          </p>
          <p class="text-body-1">
            We all know students need to practise exam-style questions. Yet most
            websites focus on multiple choice and gap fills. But GCSE papers
            aren’t multiple choice.
            <span class="font-weight-bold"
              >A typical Computer Science paper is only 13% closed
              questions</span
            >. Therefore, it’s essential students practise written answer
            questions in order to do well.
          </p>
          <p class="text-body-1">
            Frequent testing using existing question banks is a hassle. In my
            department, this meant finding and photocopying questions, marking
            them by hand and then painstakingly copying the results into a
            spreadsheet. Examgap streamlines this process with tick-box marking,
            an automated comment bank, and detailed grade book.
          </p>
          <p class="text-body-1">
            If you’re a Computing teacher, please give Examgap a try. You can
            <nuxt-link to="/trial"
              ><span class="font-weight-bold">try it for free</span></nuxt-link
            >
            with no payment information.
          </p>
          <p>
            If you have any questions or feedback my direct email is
            <a href="mailto:owen@examgap.com">owen@examgap.com</a>.
          </p>
          <p>&mdash;Cheers, Owen</p>
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
import {
  mdiCheckboxMarkedCircleOutline,
  mdiNumeric1Circle,
  mdiNumeric2Circle,
  mdiNumeric3Circle,
  mdiCheck,
  mdiCheckBold,
  mdiMicroscope,
  mdiTextToSpeech,
  mdiSortBoolDescendingVariant,
  mdiCommentTextMultipleOutline,
  mdiTargetAccount,
  mdiDownloadOutline,
  mdiRepeat,
  mdiFlaskOutline,
} from '@mdi/js'

export default {
  layout: 'static',
  created() {
    this.$icons = {
      mdiCheckboxMarkedCircleOutline,
      mdiNumeric1Circle,
      mdiNumeric2Circle,
      mdiNumeric3Circle,
      mdiMicroscope,
      mdiCheck,
      mdiCheckBold,
      mdiTextToSpeech,
      mdiSortBoolDescendingVariant,
      mdiCommentTextMultipleOutline,
      mdiTargetAccount,
      mdiDownloadOutline,
      mdiRepeat,
      mdiFlaskOutline,
    }
  },
}
</script>

<style scoped>
/* --------- Hero --------- */
#hero-text {
  font-weight: 900;
  line-height: 1.25em;
  padding-top: 0.6em;
}

/* more padding on desktop */
@media only screen and (min-width: 960px) {
  #hero-text {
    padding-top: 1em;
  }
}

.highlight {
  position: relative;
  white-space: nowrap;
}
.highlight:before {
  content: '';
  background-color: #ef7a85;
  opacity: 0.35;
  width: 108%;
  height: 1em;
  position: absolute;
  filter: url(#marker-shape);
  left: -0.25em;
  top: 0.1em;
  padding: 0 0.25em;
  transform: rotate(-1deg);
}

.summary {
  font-size: 1.3em !important;
  letter-spacing: 0.0125em;
}
@media only screen and (max-width: 600px) {
  .summary {
    font-size: 1em !important;
    line-height: 1.5em;
  }
}

/* ------- Why use? ------- */
#why {
  margin-top: 3em;
  margin-bottom: 3em;
}

@media only screen and (min-width: 600px) {
  .pad-l {
    padding-left: 5em;
  }
}

@media only screen and (min-width: 600px) {
  .pad-r {
    padding-right: 5em;
  }
}

/* ----- Testamonials ----- */
.testamonial {
  height: 300px;
}
@media only screen and (max-width: 600px) {
  .long-test {
    height: 400px;
    padding-bottom: 5em;
  }
}

/* add borders on desktop */
@media only screen and (min-width: 600px) {
  .border-top-bottom {
    border-top: 1px solid rgb(224, 224, 224) !important;
    border-bottom: 1px solid rgb(224, 224, 224) !important;
  }

  .border-left {
    border-left: 1px solid rgb(224, 224, 224) !important;
  }
}

/* --------- How ---------- */
#how {
  background-color: #0078a0 !important;
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

/* tilt cards on desktop */
@media only screen and (min-width: 960px) {
  #card1 {
    transform: rotate(-1.5deg);
  }

  #card2 {
    transform: rotate(1.3deg);
  }

  #card3 {
    transform: rotate(-1deg);
  }
}

/* ------- Research ------- */
#research {
  padding-top: 4em;
  padding-bottom: 4em;
}
@media only screen and (max-width: 600px) {
  #research {
    padding-top: 2em;
    padding-bottom: 2em;
  }
}

/* -------- Boards -------- */
#boards {
  padding-top: 3em;
  padding-bottom: 8em;
}
/* reduce spacing on mobile */
@media only screen and (max-width: 600px) {
  #boards {
    padding-top: 2em;
    padding-bottom: 5em;
  }
}

/* ------ What else? ------ */
#what {
  background-color: #0078a0 !important;
  padding-top: 4em;
  padding-bottom: 6em;
}

#what-text {
  color: #f1f3f8;
  line-height: 1.375em;
  font-weight: 800;
  margin-bottom: 1em;
}

/* --------- Misc --------- */

/* large headings */
.sub-hero-text {
  line-height: 1.375em;
  font-size: 2.125em;
  font-weight: 800;
}

.illum {
  border-bottom: 6px solid #ef7a85;
}

/* add vertical space between screenshots */
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

/* icon circles */
.ico-bg {
  display: inline-flex;
  padding: 5px;
  border-radius: 50%;
  background-color: #0078a0;
}

#owen {
  border-radius: 8px;
}

#written {
  padding-top: 6em;
  padding-bottom: 3em;
}

/* ----- Featured in  ----- */
#featured {
  padding-top: 3em;
  padding-bottom: 3em;
}
</style>
