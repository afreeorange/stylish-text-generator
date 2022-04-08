<script lang="ts">
  import { mapInput } from "./helpers";

  const handleClick = (style) => {
    const e = document.querySelector<HTMLElement>(`[data-style="${style}"]`);
    navigator.clipboard.writeText(e.innerText);
  };

  let text = ``;
  console.log(mapInput(text));
  $: styles = mapInput(text);
  $: show = text.length === 0 ? false : true;
</script>

<input bind:value={text} placeholder="type something..." />

<main>
  {#each Object.keys(styles) as style}
    <p on:click={() => handleClick(style)}>
      <small>{style}</small>
      {#if show}
        <div data-style={style}>
          {styles[style]}
        </div>
      {/if}
    </p>
  {/each}
</main>
