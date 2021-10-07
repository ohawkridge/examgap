<template>
  <v-main>
    <div id="hero">
      <v-container class="pa-4">
        <v-row id="choose">
          <v-col cols="12">
            <p class="text-h5 text-md-h3 font-weight-black text-center">
              Choose your Computing package
            </p>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="4">
            <v-card class="gcse pa-3" outlined rounded="lg">
              <v-card-title class="text-h6 font-weight-black">
                GCSE
              </v-card-title>
              <v-card-subtitle class="text-overline">
                9-1 Computer Science
              </v-card-subtitle>
              <v-card-text class="text-body-1">
                <p class="text-h4 font-weight-bold">
                  £79 <span class="text-overline">/ YEAR</span>
                </p>
                <p class="mb-2">
                  <i class="fa-regular fa-circle-check mr-2 ico-blue"></i>
                  Improve your results
                </p>
                <p class="mb-2">
                  <i class="fa-regular fa-circle-check mr-2 ico-blue"></i>
                  Unlock more 8-9 grades
                </p>
                <p class="mb-2">
                  <i class="fa-regular fa-circle-check mr-2 ico-blue"></i>
                  Mark more efficiently
                </p>
                <p class="mb-4">
                  <i class="fa-regular fa-circle-check mr-2 ico-blue"></i>
                  Diagnose weaknesses
                </p>
                <p class="text-caption mb-0">
                  <nuxt-link nuxt to="/#boards"
                    >Which boards do you support?</nuxt-link
                  >
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  block
                  rounded
                  elevation="0"
                  nuxt
                  to="/trial"
                >
                  Get a 30-day free trial
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-3" outlined rounded="lg" disabled>
              <v-card-title class="font-weight-black text-h6">
                A Level
              </v-card-title>
              <v-card-subtitle class="text-overline">
                Coming Soon
              </v-card-subtitle>
              <v-card-text class="text-body-1">
                <p class="text-h4 font-weight-bold">
                  £79 <span class="text-overline">/ YEAR</span>
                </p>
                <p class="mb-2">
                  <i class="fa-regular fa-circle-check mr-2 ico-grey"></i>
                  Improve your results
                </p>
                <p class="mb-2">
                  <i class="fa-regular fa-circle-check mr-2 ico-grey"></i>
                  Differentiate quickly
                </p>
                <p class="mb-2">
                  <i class="fa-regular fa-circle-check mr-2 ico-grey"></i>
                  Support independent study
                </p>
                <p class="mb-4">
                  <i class="fa-regular fa-circle-check mr-2 ico-grey"></i>
                  Create your own questions
                </p>
                <p class="text-caption mb-0">
                  <nuxt-link nuxt to="/#boards" class="grey--text"
                    >Which boards do you support?</nuxt-link
                  >
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn block rounded outlined nuxt to="/trial">
                  Coming Soon
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container id="features">
      <v-row class="d-flex justify-center md-pad">
        <v-col cols="12" md="9">
          <p class="text-h5 text-md-h4 font-weight-bold text-center mb-10">
            All packages include:
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center text-center">
        <v-col cols="12" md="3">
          <v-card class="rounded-lg pa-3" outlined>
            <div class="d-flex justify-center">
              <i class="fa-regular fa-check fa-4x"></i>
            </div>
            <v-card-text
              class="text-h6 d-flex justify-center py-0 font-weight-bold"
              >Unlimited students</v-card-text
            >
            <v-card-text class="text-body-1">
              <p class="mb-0">Create as many student accounts as you need.</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="rounded-lg pa-3" outlined>
            <div class="d-flex justify-center">
              <i class="fa-regular fa-check fa-4x"></i>
            </div>
            <v-card-text
              class="text-h6 d-flex justify-center py-0 font-weight-bold"
              >Unlimited classes</v-card-text
            >
            <v-card-text class="text-body-1">
              <p class="mb-0">
                Create unlimited classes and intervention groups.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="rounded-lg pa-3" outlined>
            <div class="d-flex justify-center">
              <i class="fa-regular fa-check fa-4x"></i>
            </div>
            <v-card-text
              class="text-h6 d-flex justify-center py-0 font-weight-bold"
              >Unlimited teachers</v-card-text
            >
            <v-card-text class="text-body-1">
              <p class="mb-0">Extra teacher accounts if you need them.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center text-center mt-4">
        <v-col cols="12" md="3">
          <v-card class="pa-3 rounded-lg" outlined>
            <div class="d-flex justify-center">
              <i class="fa-regular fa-check fa-4x"></i>
            </div>
            <v-card-text
              class="text-h6 d-flex justify-center py-0 font-weight-bold"
              >Solo Revision</v-card-text
            >
            <v-card-text class="text-body-1">
              <p class="mb-0">Students can practise questions on their own.</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3 rounded-lg" outlined>
            <div class="d-flex justify-center">
              <i class="fa-regular fa-check fa-4x"></i>
            </div>
            <v-card-text
              class="text-h6 d-flex justify-center py-0 font-weight-bold"
              >Relevant questions</v-card-text
            >
            <v-card-text class="text-body-1">
              <p class="mb-0">All questions are course and board specific.</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="pa-3 rounded-lg" outlined>
            <div class="d-flex justify-center">
              <i class="fa-regular fa-check fa-4x"></i>
            </div>
            <v-card-text
              class="text-h6 d-flex justify-center py-0 font-weight-bold"
              >Create questions</v-card-text
            >
            <v-card-text class="text-body-1">
              <p class="mb-0">Create your own customised questions.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <div id="try">
      <v-container>
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
              Try Examgap for free
            </p>
            <v-btn
              x-large
              color="white"
              outlined
              rounded
              elevation="0"
              nuxt
              to="/trial"
            >
              Get a 30-day free trial
            </v-btn>
            <div class="mt-4 white--text d-flex justify-center">
              <small>
                <i class="fa-regular fa-check ico-pink"></i>
                No payment info
                <i class="fa-regular fa-check ico-pink ml-2"></i>
                Improve your results
              </small>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container id="common">
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="6">
          <p class="text-h5 text-md-h4 font-weight-bold text-center mb-8">
            Common Questions
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center">
        <v-col cols="12" md="5">
          <p class="text-h6 text-center">Do you offer discounts?</p>
          <p>
            Not currently. In the future, there will be discounts on multiple
            packages. For example, GCSE and A Level purchased together.
          </p>
        </v-col>
        <v-col cols="12" md="5">
          <p class="text-h6 text-center">What about multi-academy trusts?</p>
          <p>
            Please contact
            <a href="mailto:support@examgap.com">support@examgap.com</a>
            for a custom quote covering multiple schools. All quotes are
            provided free with no obligation.
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center text-body-1">
        <v-col cols="12" md="5">
          <p class="text-h6 text-center">What if I subscribe mid-year?</p>
          <p>
            We can prorate your subscription for one year plus the portion of
            the academic year remaining.
          </p>
          <p>
            This means you never have to worry about your subscription expiring
            in the middle of teaching.
          </p>
        </v-col>
        <v-col cols="12" md="5">
          <p class="text-h6 text-center">Why don't you offer auto-marking?</p>
          <p>
            By marking student's responses yourself, you gain valuable insight
            into where they've gone wrong. Automated systems can't offer that
            yet.
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center text-body-1">
        <v-col cols="12" md="5">
          <p class="text-h6 text-center">Can I get a longer trial?</p>
          <p>
            Yes, no problem. Just email
            <a href="mailto:support@examgap.com">support@examgap.com</a>
            or use the contact form at the bottom of the page and let us know
            you'd like more time.
          </p>
        </v-col>
        <v-col cols="12" md="5">
          <p class="text-h6 text-center">What if I have more questions?</p>
          <p>
            You can email
            <a href="mailto:support@examgap.com">support@examgap.com</a>
            with questions or to arrange a phone call or demonstration.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
export default {
  layout: 'static',
  head() {
    return {
      title: 'Pricing',
    }
  },
}
</script>

<style scoped>
#choose p {
  color: #002e3e;
}
@media only screen and (min-width: 600px) {
  #choose {
    margin-bottom: 2em;
  }
}

.gcse {
  border: 2px solid #0099cc;
}

@media only screen and (min-width: 600px) {
  #hero {
    padding-top: 4em;
    padding-bottom: 3em;
  }
}

/* .ico-bg {
  position: relative;
  top: -28px;
  display: inline-flex;
  padding: 2px;
  border-radius: 50%;
  background-color: #0099cc;
} */

#features {
  margin-top: 4em;
  padding-bottom: 2em;
}

#try {
  background-color: #0099cc;
  margin-top: 4em;
  margin-bottom: 4em;
  padding-top: 4em;
  padding-bottom: 4em;
}

#common {
  margin-bottom: 4em;
  padding-bottom: 3em;
}
</style>
