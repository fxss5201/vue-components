<template>
  <vue-json-pretty
    :data="props.json"
    showLength
    showLine
    showLineNumber
    showIcon
    showDoubleQuotes
  />
</template>

<script setup lang="ts">
import vueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { JSONDataType } from 'vue-json-pretty/types/utils'

const props = withDefaults(
  defineProps<{
    json: JSONDataType
  }>(),
  {}
)
</script>
