<script>
import { exceptionToErrorsArray } from '@shell/utils/error';
import { alternateLabel } from '@shell/utils/platform';
import AsyncButton from '@shell/components/AsyncButton';
import { Banner } from '@components/Banner';
import { Card } from '@components/Card';
import CopyToClipboardText from '@shell/components/CopyToClipboardText';

/**
 * @name ConfirmNameToRemoveDialog
 * @description Dialog component to confirm name before removing the resource.
 */
export default {
  name: 'ConfirmNameToRemoveDialog',

  components: {
    AsyncButton,
    Banner,
    Card,
    CopyToClipboardText
  },

  props:  {
    /**
     * @property resources to be deleted.
     * @type {Resource[]} Array of the resource model's instance
     */
    resources: {
      type:     Array,
      required: true
    }
  },

  data() {
    return { errors: [], confirmName: '' };
  },

  computed: {
    nameToMatch() {
      return this.resources[0].nameDisplay;
    },

    deleteDisabled() {
      return this.confirmName !== this.nameToMatch;
    },

    protip() {
      return this.t('promptRemove.protip', { alternateLabel });
    },
  },

  methods: {
    close() {
      this.confirmName = '';
      this.errors = [];
      this.$emit('close');
    },

    async remove(buttonDone) {
      try {
        await this.resources[0].remove();
        buttonDone(true);
        this.close();
      } catch (e) {
        this.errors = exceptionToErrorsArray(e);
        buttonDone(false);
      }
    }
  }
};
</script>

<template>
  <Card class="prompt-restore" :show-highlight-border="false">
    <h4 slot="title" class="text-default-text">
      {{ t('promptForceRemove.modalTitle') }}
    </h4>
    <div slot="body" class="pl-10 pr-10">
      <span
        v-html="t('promptForceRemove.removeWarning', { nameToMatch }, true)"
      ></span>
      <div class="mt-10 mb-10">
        {{ t('promptForceRemove.confirmName') }}
      </div>
      <div class="mb-10">
        <CopyToClipboardText :text="nameToMatch" />
      </div>
      <input id="confirm" v-model="confirmName" type="text" />
      <div class="text-info mt-20">
        {{ protip }}
      </div>
      <Banner v-for="(error, i) in errors" :key="i" class="" color="error" :label="error" />
    </div>
    <template #actions>
      <button class="btn role-secondary mr-10" @click="close">
        {{ t('generic.cancel') }}
      </button>
      <AsyncButton mode="delete" class="btn bg-error ml-10" :disabled="deleteDisabled" @click="remove" />
    </template>
  </Card>
</template>

<style lang='scss' scoped>
  .actions {
    text-align: right;
  }
</style>
