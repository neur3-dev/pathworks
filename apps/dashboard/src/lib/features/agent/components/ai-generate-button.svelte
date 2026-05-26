<script lang="ts">
  interface Props {
    onInsert: (text: string) => void;
    context?: string;
    format?: 'plain' | 'html';
    courseId?: string;
    align?: 'start' | 'center' | 'end';
  }

  let {}: Props = $props();
</script>
