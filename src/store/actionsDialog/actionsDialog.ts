export default {
  namespaced: true,
  state(): ActionsDialogState {
    return {
      isVisible: false,
      path: "",
      fileCopiedPath: "",
      fileCutPath: "",
    };
  },
  mutations: {},
  actions: {},
  getters: {},
};

interface ActionsDialogState {
  isVisible: boolean;
  path: string;
  fileCopiedPath: string;
  fileCutPath: string;
}
