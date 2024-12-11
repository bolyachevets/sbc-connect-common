export const useTestStore = defineStore('core-test-store', () => {
  const testData = ref('123')

  function $reset () {
    testData.value = ''
  }

  return {
    testData,
    $reset
  }
})
