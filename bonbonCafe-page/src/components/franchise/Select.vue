<template>
    <v-select
      :placeholder="placeholder"
      :items="items"
      v-model="selected"
      density="comfortable"
      variant="outlined"
      flat="false"
      return-object
      item-title="label"
      item-value="value"
      @update:modelValue="onChange"
      class="selectBox"
    />
</template>

<script setup>
    import { ref, watch } from 'vue'
    const props = defineProps({
    placeholder: String,
    items: {
        type: Array,
        required: true
    },
    modelValue: [String, Object] // 부모 바인딩 지원
})



const emit = defineEmits(['update:modelValue'])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  selected.value = val
})

function onChange(value) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.selectBox{
  background-color: white;
  height: 48px;
}


</style>

