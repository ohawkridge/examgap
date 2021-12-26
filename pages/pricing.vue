<template>
  <v-main>
    <div id="hero">
      <v-container class="pa-4">
        <v-row id="choose">
          <v-col cols="12">
            <p class="text-h4 text-md-h2 font-weight-black text-center">
              Try it free for 30 days
            </p>
            <p class="sub-hero text-center mb-0">
              Frequent low stakes testing.
            </p>
            <p class="sub-hero text-center mb-0">
              Assessment with a positive impact.
            </p>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="5" sm="7">
            <v-card class="gcse pa-5" outlined rounded="lg" hover>
              <v-card-title class="text-h6 font-weight-black">
                GCSE 9-1 Computer Science
              </v-card-title>
              <v-card-text class="text-body-1">
                <p class="text-h3 font-weight-bold mb-2">
                  £7 <span class="text-overline">/ MONTH</span>
                </p>
                <p class="text-body-2">(Billed annually—£84/year)</p>
                <p class="d-flex align-center text-subtitle-1">
                  <img
                    src="/ico-results.svg"
                    class="mr-4"
                    width="40px"
                    title="User chart"
                  />
                  Improve your results
                </p>
                <p class="d-flex align-center text-subtitle-1">
                  <img
                    src="/ico-lock.svg"
                    class="mr-4"
                    width="40px"
                    title="Lock open"
                  />
                  Unlock more 8-9 grades
                </p>
                <p class="d-flex align-center text-subtitle-1">
                  <img
                    src="/ico-gifts.svg"
                    class="mr-4"
                    width="40px"
                    title="Gifts"
                  />
                  Thoughtful features
                </p>
                <p class="text-body-2">
                  <nuxt-link nuxt to="/#boards"
                    >Which boards do you support?</nuxt-link
                  >
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="yell"
                  block
                  rounded
                  elevation="0"
                  nuxt
                  to="/trial"
                >
                  <span class="heading--text">Get a 30-day free trial</span>
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
            All packages include
          </p>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center text-center">
        <v-col cols="12" md="4" lg="3">
          <v-card class="rounded-lg pa-3" outlined>
            <div class="d-flex justify-center">
              <font-awesome-icon
                icon="fa-light fa-check"
                class="fa-xl ico-bg2"
              />
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
        <v-col cols="12" md="4" lg="3">
          <v-card class="rounded-lg pa-3" outlined>
            <div class="d-flex justify-center">
              <font-awesome-icon
                icon="fa-light fa-check"
                class="fa-xl ico-bg2"
              />
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
        <v-col cols="12" md="4" lg="3">
          <v-card class="rounded-lg pa-3" outlined>
            <div class="d-flex justify-center">
              <font-awesome-icon
                icon="fa-light fa-check"
                class="fa-xl ico-bg2"
              />
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
        <v-col cols="12" md="4" lg="3">
          <v-card class="pa-3 rounded-lg" outlined>
            <div class="d-flex justify-center">
              <font-awesome-icon
                icon="fa-light fa-check"
                class="fa-xl ico-bg2"
              />
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
        <v-col cols="12" md="4" lg="3">
          <v-card class="pa-3 rounded-lg" outlined>
            <div class="d-flex justify-center">
              <font-awesome-icon
                icon="fa-light fa-check"
                class="fa-xl ico-bg2"
              />
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
        <v-col cols="12" md="4" lg="3">
          <v-card class="pa-3 rounded-lg" outlined>
            <div class="d-flex justify-center">
              <font-awesome-icon
                icon="fa-light fa-check"
                class="fa-xl ico-bg2"
              />
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
              class="text-h5 text-md-h4 font-weight-bold white--text text-center mb-8"
            >
              Try Examgap for free
            </p>
            <v-btn x-large color="yell" rounded elevation="0" nuxt to="/trial">
              <span class="heading--text">Get a 30-day free trial</span>
            </v-btn>
            <div class="mt-4 white--text d-flex justify-center">
              <small>
                <font-awesome-icon
                  icon="fa-light fa-check-circle"
                  class="ico-light-pink"
                />
                No payment info
                <font-awesome-icon
                  icon="fa-light fa-check-circle"
                  class="ico-light-pink ml-2"
                />
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

.sub-hero {
  font-size: 1.4em !important;
  letter-spacing: 0.0125em;
}

.gcse {
  background-color: #fafafa;
}

@media only screen and (min-width: 600px) {
  #hero {
    padding-top: 4em;
    padding-bottom: 1em;
  }
}

.ico-bg {
  border: 1px solid #4dbfe6;
  display: inline-flex;
  padding: 6px;
  border-radius: 50%;
  background-color: rgba(0, 153, 204, 0.2);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
}

.ico-bg2 {
  position: relative;
  top: -28px;
  display: inline-flex;
  padding: 5px;
  border-radius: 50%;
  background-color: #0099cc;
  color: #ffffff;
}

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
