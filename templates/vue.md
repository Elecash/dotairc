## Vue.js Style Guide

You're an expert Vue.js architect following the official Vue.js Style Guide

Critical Requirements:

Priority A (Essential):

1. Use multi-word component names to avoid conflicts with HTML elements
```vue
<!-- Bad -->
<template>
  <header>...</header>
</template>

<!-- Good -->
<template>
  <app-header>...</app-header>
</template>
```

2. Use PascalCase for component names in SFCs
```vue
<!-- Bad -->
<script>
export default {
  name: 'userprofile'
}
</script>

<!-- Good -->
<script>
export default {
  name: 'UserProfile'
}
</script>
```

3. Use proper prop definitions
```vue
<!-- Bad -->
<script>
export default {
  props: ['status']
}
</script>

<!-- Good -->
<script>
export default {
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['active', 'inactive'].includes(value)
    }
  }
}
</script>
```

4. Use keyed v-for directives
```vue
<!-- Bad -->
<template>
  <div v-for="item in items">
    {{ item.name }}
  </div>
</template>

<!-- Good -->
<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

5. Never use v-for with v-if on the same element
```vue
<!-- Bad -->
<template>
  <div v-for="user in users" v-if="user.isActive">
    {{ user.name }}
  </div>
</template>

<!-- Good -->
<template>
  <div v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </div>
</template>

<script setup>
const activeUsers = computed(() => users.value.filter(user => user.isActive))
</script>
```

Priority B (Strongly Recommended):

1. Component Naming Conventions
```vue
<!-- Base Components -->
<template>
  <BaseButton>Click me</BaseButton>
</template>

<!-- Single Instance Components -->
<template>
  <TheHeader />
  <TheFooter />
</template>

<!-- Parent-Child Components -->
<template>
  <TodoList>
    <TodoListItem v-for="item in items" :key="item.id" :item="item" />
  </TodoList>
</template>
```

2. Component Property Order
```vue
<script>
export default {
  name: 'UserProfile',
  
  components: {
    BaseButton,
    UserAvatar
  },
  
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    // Composition API setup
  },
  
  data() {
    return {
      user: null
    }
  },
  
  computed: {
    fullName() {
      return `${this.user.firstName} ${this.user.lastName}`
    }
  },
  
  methods: {
    updateUser() {
      // Method implementation
    }
  },
  
  mounted() {
    // Lifecycle hook
  }
}
</script>
```

Priority C (Recommended):

1. Template Shorthand Syntax
```vue
<!-- Bad -->
<template>
  <button v-bind:class="buttonClass" v-on:click="handleClick">
    Click me
  </button>
</template>

<!-- Good -->
<template>
  <button :class="buttonClass" @click="handleClick">
    Click me
  </button>
</template>
```

Component Architecture:

1. Composition API with `<script setup>`
```vue
<!-- Bad -->
<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<!-- Good -->
<script setup>
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
</script>
```

2. TypeScript Integration
```vue
<!-- Bad -->
<script>
export default {
  props: {
    user: Object
  }
}
</script>

<!-- Good -->
<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
}

defineProps<{
  user: User
}>()
</script>
```

State Management:

1. Pinia Store Pattern
```typescript
// Bad
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(user) {
      this.user = user
    }
  }
})

// Good
export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  
  function setUser(newUser: User) {
    user.value = newUser
  }
  
  return {
    user,
    setUser
  }
})
```

Performance:

1. Lazy Loading Components
```typescript
// Bad
import HeavyComponent from './HeavyComponent.vue'

// Good
const HeavyComponent = defineAsyncComponent(() => 
  import('./HeavyComponent.vue')
)
```

2. Computed Properties
```vue
<!-- Bad -->
<template>
  <div>{{ getFullName() }}</div>
</template>

<script setup>
function getFullName() {
  return `${firstName} ${lastName}`
}
</script>

<!-- Good -->
<template>
  <div>{{ fullName }}</div>
</template>

<script setup>
const fullName = computed(() => `${firstName.value} ${lastName.value}`)
</script>
```

Testing:

1. Component Testing
```typescript
// Bad
test('button click', () => {
  const wrapper = mount(MyComponent)
  wrapper.find('button').trigger('click')
})

// Good
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

describe('MyComponent', () => {
  it('emits click event when button is clicked', async () => {
    const wrapper = mount(MyComponent)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

Additional Best Practices:

1. Error Handling
```vue
<!-- Bad -->
<script setup>
const fetchData = async () => {
  const data = await api.getData()
  // No error handling
}
</script>

<!-- Good -->
<script setup>
const fetchData = async () => {
  try {
    const data = await api.getData()
    return data
  } catch (error) {
    console.error('Failed to fetch data:', error)
    // Handle error appropriately
  }
}
</script>
```

2. Form Validation
```vue
<!-- Bad -->
<template>
  <form @submit="handleSubmit">
    <input v-model="email" />
    <button type="submit">Submit</button>
  </form>
</template>

<!-- Good -->
<template>
  <form @submit.prevent="handleSubmit">
    <input 
      v-model="email" 
      :class="{ 'error': v$.email.$error }"
      @blur="v$.email.$touch()"
    />
    <span v-if="v$.email.$error" class="error-message">
      {{ v$.email.$errors[0].$message }}
    </span>
    <button type="submit" :disabled="v$.$invalid">Submit</button>
  </form>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const rules = {
  email: { required, email }
}

const v$ = useVuelidate(rules, { email })
</script>
```
