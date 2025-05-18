<template>
    <v-select
    :placeholder="placeholder"
    :items="items"
    v-model="selected"
    density="compact"
    variant="solo"
    return-object
    item-title="label"
    item-value="value"
    @update:modelValue="onChange"
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

</style>