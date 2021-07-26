import { findBy } from '@/utils/array';
import { get } from '@/utils/object';

export default {
  message() {
    const conditions = get(this, 'status.conditions');

    return (findBy(conditions, 'type', 'Ready') || {}).message ;
  },

  isReady() {
    const conditions = get(this, 'status.conditions');

    return (findBy(conditions, 'type', 'Ready') || {})?.status === 'True';
  },

  physicalNics() {
    return this?.status?.physicalNICs || [];
  },

  attachNodeName() {
    return get(this, `metadata.labels."network.harvesterhci.io/nodename"`) || '';
  },

  linkMessage() {
    return {
      name:    this.attachNodeName,
      message: this.message,
      to:      `host/${ this.attachNodeName }?mode=edit`
    };
  }
};
