<script>
  import { rangeAN } from "./range";
  /**
   * @param {string} code
   */
  const codeToNumber = (code) => {
    let number = 0;
    number += rangeAN.indexOf(code.charAt(0)) * Math.pow(16, 5) * Math.pow(62, 4);
    number += rangeAN.indexOf(code.charAt(1)) * Math.pow(16, 5) * Math.pow(62, 3);
    number += rangeAN.indexOf(code.charAt(2)) * Math.pow(16, 5) * Math.pow(62, 2);
    number += rangeAN.indexOf(code.charAt(3)) * Math.pow(16, 5) * Math.pow(62, 1);
    number += rangeAN.indexOf(code.charAt(4)) * Math.pow(16, 5) * Math.pow(62, 0);
    number += parseInt(code.slice(6), 16);
    return number;
  };
  /**
   * @param {number} number
   */
  const numberToCode = (number) => {
    let code = "-" + (number % Math.pow(16, 5)).toString(16).padStart(5, "0");

    number = Math.floor(number / Math.pow(16, 5));
    for (let i = 0; i < 5; i++) {
      code = rangeAN[number % 62] + code;
      number = Math.floor(number / 62);
    }
    return code;
  };
  /**
   * @param {number} number
   */
  const numberToUnicode = (number) => {
    let unicode = "";
    while (number > 0) {
      unicode = String.fromCharCode((number % 16) + 8288) + unicode;
      number = Math.floor(number / 16);
    }
    return unicode;
  };

  let mode = "number";
  let number = 0;
  let code = "00000-00000";
  let flagInput;
  const updateFromNumber = (e) => {
    code = numberToCode(e.currentTarget.value);
  };
  const updateFromUnicode = (e) => {
    const chars = Array.from(e.currentTarget.value, (char) => char.charCodeAt(0)).filter(
      (char) => char >= 8288 && char <= 8303,
    );

    number = 0;
    for (let i = 0; i < chars.length; i++) {
      number = number * 16 + chars[i] - 8288;
    }
    code = numberToCode(number);
  };
  const updateFromFlag = () => {
    if (!flagInput.value) return;
    const newNumber = parseInt(flagInput.value.replace(/[^0-9a-f]/gi, ""), 16);
    if (!isFinite(newNumber)) return;
    number = newNumber;
    code = numberToCode(number);
  };
  const updateFromCode = () => {
    if (code.length != 11) return;
    const newNumber = codeToNumber(code);
    if (!isFinite(newNumber)) return;
    number = newNumber;
  };
  $: if (code && mode) updateFromCode();
</script>

<h1 class="m3-font-display-large">dearrow trolling</h1>
<div class="chooser">
  <select bind:value={mode}>
    <option>number</option>
    <option>flag</option>
    <option>unicode</option>
  </select>
  ↔ code
</div>
<div class="options">
  <div>
    <h2 class="m3-font-headline-large">{mode}</h2>
    {#if mode == "number"}
      <input type="number" class="m3-font-label-large" value={number} on:input={updateFromNumber} />
    {:else if mode == "flag"}
      {@const band1 = Math.floor(number / Math.pow(16, 12)) % Math.pow(16, 6)}
      {@const band2 = Math.floor(number / Math.pow(16, 6)) % Math.pow(16, 6)}
      {@const band3 = number % Math.pow(16, 6)}
      <div class="flag">
        <div style="background-color: #{band1.toString(16).padStart(6, '0')}" />
        <div style="background-color: #{band2.toString(16).padStart(6, '0')}" />
        <div style="background-color: #{band3.toString(16).padStart(6, '0')}" />
      </div>
      <div class="loader">
        <p style="margin-bottom: 0.5rem">Load code from flag</p>
        <div class="row">
          <input
            class="m3-font-label-large"
            bind:this={flagInput}
            placeholder="concatenated hex codes"
          />
          <button on:click={updateFromFlag}>→</button>
        </div>
      </div>
    {:else if mode == "unicode"}
      <input
        class="m3-font-label-large"
        value={numberToUnicode(number)}
        on:input={updateFromUnicode}
      />
      <p style="margin-top: 1rem">
        tip: if you paste a message made up of other things than the unicode, we'll extract the
        unicode out
      </p>
    {/if}
  </div>
  <div>
    <h2 class="m3-font-headline-large">code</h2>
    <input type="text" class="m3-font-label-large" bind:value={code} on:input={updateFromCode} />
  </div>
</div>

<style>
  h1 {
    text-align: center;
    margin: 0 0 2rem 0;
  }
  h2 {
    text-align: center;
    margin: 0 0 1rem 0;
  }
  p {
    margin: 0;
  }
  .chooser {
    margin: 0 auto 1rem auto;
  }
  .chooser select {
    border: none;
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 0 0.5rem;
    height: 2rem;
    border-radius: 0.5rem;
  }
  .options {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  .options > div {
    display: flex;
    flex-direction: column;
    max-width: 16rem;
    background-color: rgb(var(--m3-scheme-surface-container));
    padding: 1rem;
    border-radius: 1.5rem;
  }
  .options input {
    border: none;
    background-color: rgb(var(--m3-scheme-surface-container-high));
    padding: 0 0.5rem;
    height: 2rem;
    border-radius: 0.5rem;
  }
  .flag {
    margin-bottom: 1rem;
  }
  .flag > div {
    height: 2rem;
  }

  .loader .row {
    display: flex;
    gap: 0.5rem;
  }
  .loader input {
    min-width: 0;
  }
  .loader button {
    border: none;
    background-color: rgb(var(--m3-scheme-surface-container-high));
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
</style>
