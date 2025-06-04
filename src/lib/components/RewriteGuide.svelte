<script lang="ts">
    import { Box, Check, PanelLeftClose, X} from '@lucide/svelte';
    import { onMount, onDestroy } from 'svelte';
  
    interface Principle {
      title: string;
      subtitle: string;
      quickTip: string;
      img: string;
      thirtySecondCheck: string[];
    }

    let { showModal, onClose } = $props<{ showModal: boolean, onClose: () => void }>();
  

    function closeModal() {
      console.log('Closing modal');
      showModal = false;
      onClose();
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && showModal) {
        closeModal();
      }
    }

    onMount(() => {
      window.addEventListener('keydown', handleKeydown);
    });

    onDestroy(() => {
      window.removeEventListener('keydown', handleKeydown);
    });

    function handleBackdropClick() {
      closeModal();
    }

    function handleModalClick(event: MouseEvent) {
      // Prevent the backdrop click handler from being triggered when clicking inside the modal
      event.stopPropagation();
    }

    function handleBackdropKeydown(event: KeyboardEvent) {
      // Prevent keyboard events from bubbling up to the backdrop
      event.stopPropagation();
    }

    function handleModalKeydown(event: KeyboardEvent) {
      // Prevent keyboard events from bubbling up to the backdrop
      event.stopPropagation();
    }
  
    const principles: Principle[] = [
      {
        title: 'Tell the human story',
        subtitle: 'Every crash involves real people with families, jobs, and communities. Adding human details helps readers understand the real impact.',
        quickTip: 'Include at least one human detail when available. Just mentioning the age can make a big difference.',
        img: '/frames/Dehumanization.png',
        thirtySecondCheck: [
            'Did I name a human being or include basic details (age, occupation)?',
            'Did I use "driver" instead of "car" when possible?',
            'Does my headline highlight the people involved?'
        ],
      },
      {
        title: 'Connect the dots',
        subtitle: 'When you can connect a crash to broader context, you help communities identify dangerous spots and push for improvements.',
        quickTip: 'When time allows, one quick search for previous crashes at the same location can add valuable context.',
        img: '/frames/Episodic_framing.png',
        thirtySecondCheck: [
          'Have there been other crashes at this location?',
          'Are there known safety concerns or planned improvements here?',
          'Can I add one sentence of broader context?'
        ],
      },
      {
        title: 'Balance the coverage',
        subtitle: 'Helps readers understand contributing factors without suggesting that victims could have prevented their own injuries or deaths.',
        quickTip: 'When mentioning victim actions or characteristics, consider whether the same level of detail is available about other contributing factors.',
        img: '/frames/Victim_blaming.png',
        thirtySecondCheck: [
          'Am I giving equal attention to all parties involved?',
          'Am I asking "Why was this street dangerous?" rather than "Why wasn\'t the victim more careful?"'
        ],
      },
      {
        title: 'Highlight the preventable',
        subtitle: 'Highlighting preventable factors helps communities and officials identify solutions rather than accepting crashes as unavoidable.',
        quickTip: 'Use "crash" instead of "accident" and mention factors that could prevent similar crashes.',
        img: '/frames/Naturalization.png',
        thirtySecondCheck: [
          'Can I use "crash" instead of "accident"?',
          'Are there preventable factors I can mention (speed, road design, visibility)?',
          'Does my language suggest solutions are possible rather than implying inevitability?'
        ],
      },
      {
        title: 'Consider all road users',
        subtitle: 'Your coverage can acknowledge that streets belong to everyone. Drivers, cyclists, pedestrians and transit users all deserve safety and consideration.',
        quickTip: 'Check if your coverage suggests that keeping cars moving is more urgent than preventing deaths and injuries.',
        img: '/frames/Motonormativity.png',
        thirtySecondCheck: [
          'Does my word choice recognize that readers use different modes of transportation?',
          'Am I treating all road users (drivers, cyclists, pedestrians, transit users) as equally important?'
        ],
      },
    ];

    let checkedPrinciples = $state<boolean[]>(principles.map(() => false));
    
    // Add state for tracking individual check items
    let checkedItems = $state<boolean[][]>(principles.map(p => Array(p.thirtySecondCheck.length).fill(false)));
    
    function handlePrincipleClick(principle: Principle) {
      const index = principles.indexOf(principle);
      checkedPrinciples[index] = !checkedPrinciples[index];
      // If principle is being checked, check all items. If being unchecked, uncheck all items
      if (checkedPrinciples[index]) {
        checkedItems[index] = Array(principle.thirtySecondCheck.length).fill(true);
      } else {
        checkedItems[index] = Array(principle.thirtySecondCheck.length).fill(false);
      }
      calculateScore();
    }

    function handleCheckItemClick(principleIndex: number, checkIndex: number) {
      checkedItems[principleIndex][checkIndex] = !checkedItems[principleIndex][checkIndex];
      
      // If all checks are complete, mark the principle as complete
      const allChecked = checkedItems[principleIndex].every(checked => checked);
      checkedPrinciples[principleIndex] = allChecked;
      
      calculateScore();
    }

    let score = $state(0);

    function calculateScore() {
      score = checkedPrinciples.filter(Boolean).length;
    }

    function getScoreColor() {
      if (score === 0) return 'bg-red-900';
      if (score === 1) return 'bg-red-700';
      if (score === 2) return 'bg-orange-600';
      if (score === 3) return 'bg-yellow-500';
      if (score === 4) return 'bg-green-600';
      if (score === 5) return 'bg-green-800';
    }

    function getOverlayColor() {
      if (score === 0) return 'bg-red-900/80';
      if (score === 1) return 'bg-red-700/80';
      if (score === 2) return 'bg-orange-600/80';
      if (score === 3) return 'bg-yellow-500/80';
      if (score === 4) return 'bg-green-600/80';
      if (score === 5) return 'bg-green-800/80';
    }

    let showingQuickTip = $state<boolean[]>(principles.map(() => false));
    let showingThirtySecondCheck = $state<boolean[]>(principles.map(() => false));

    function showQuickTip(principle: Principle) {
        if (showingQuickTip[principles.indexOf(principle)]) {
            showingQuickTip[principles.indexOf(principle)] = false;
        } else {
            showingQuickTip[principles.indexOf(principle)] = !showingQuickTip[principles.indexOf(principle)];
            showingThirtySecondCheck[principles.indexOf(principle)] = false;
        }
    }

    function showThirtySecondCheck(principle: Principle) {
        if (showingThirtySecondCheck[principles.indexOf(principle)]) {
            showingThirtySecondCheck[principles.indexOf(principle)] = false;
        } else {
            showingThirtySecondCheck[principles.indexOf(principle)] = !showingThirtySecondCheck[principles.indexOf(principle)];
            showingQuickTip[principles.indexOf(principle)] = false;
        }
    }
    
    

  </script>
  
  <style>
    input[type="checkbox"] {
      accent-color: #DA291C;
    }
  </style>
  
{#if showModal}
  <div 
    class="w-screen fixed top-0 left-0 h-screen overflow-y-hidden flex items-center justify-center bg-black/80 z-50 "
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <div 
      class="bg-white w-4xl max-h-[92vh] overflow-y-auto relative p-10 pt-12"
      onclick={handleModalClick}
      onkeydown={handleModalKeydown}
      tabindex="0"
      role="dialog"
      aria-modal="true"
    >
      <p class='absolute top-4 left-4 font-bold cursor-pointer font-sans' onclick={closeModal}><X class='w-6 h-6  '/></p>
      <div class="flex flex-row justify-between items-center">
        <h1 class="text-5xl font-bold">Crash Reporting Checklist: </h1>
        <div class="{getScoreColor()} px-4 py-2 pb-4 rounded-md flex items-center justify-center transition-all duration-300"><p class="text-white text-5xl font-normal ">{score}/5</p></div>
      </div>
      <p class="text-md mb-8">Click the images to check items off.</p>
      <div class="flex flex-col gap-4">
        {#each principles as principle, index}
        <div class="flex flex-col divide-y divide-black">
          <div class="flex flex-row justify-between border border-black bg-white z-10 shadow-md hover:shadow-lg hover:scale-102  transition-all pointer-events-auto cursor-default">
            <div class="relative basis-1/5  p-3 aspect-square">
              <img src={principle.img} alt={principle.title} class="aspect-square cursor-pointer transition-all pr-4" onclick={() => handlePrincipleClick(principle)} />
              {#if checkedPrinciples[index]}
                <button class="absolute inset-0 {getOverlayColor()} flex items-center justify-center cursor-pointer" onclick={() => handlePrincipleClick(principle)}>
                  <div class="text-white text-4xl font-bold"><Check class="w-12 h-12" /></div>
                </button>
              {/if}
            </div>
            <div class="flex flex-col basis-4/5 justify-center px-6 py-4 ">
              <h2 class="text-2xl font-bold"> {index + 1}. {principle.title}<span class="text-sm text-black ml-3 font-normal">{showingQuickTip[index] ? 'Quick Tip' : ''}{showingThirtySecondCheck[index] ? '30-Second Check' : ''}</span></h2>
              {#if showingQuickTip[index]}
                <p class="text-md ">{principle.quickTip}</p>

              {:else if showingThirtySecondCheck[index]}
                <ul class="list-disc list-inside space-y-2 mt-2">
                  {#each principle.thirtySecondCheck as check, checkIndex}
                    <li class="text-md flex items-center gap-4">
                      <input 
                        type="checkbox" 
                        checked={checkedItems[index][checkIndex]}
                        onchange={() => handleCheckItemClick(index, checkIndex)}
                        class="w-4 h-4 cursor-pointer"
                      />
                      <span class='leading-tight'>{check}</span>
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="text-md ">{principle.subtitle}</p> 
              {/if}
              <div class="flex flex-row pt-4 mb-1">
                  <button class="underline underline-offset-4 pointer-events-auto cursor-pointer transition-all pr-2" onclick={() => showQuickTip(principle)}>{showingQuickTip[index] ? 'Back' : 'Quick Tip'}</button>
                  <button class="underline underline-offset-4 pointer-events-auto cursor-pointer transition-all pl-2" onclick={() => showThirtySecondCheck(principle)}>{showingThirtySecondCheck[index] ? 'Back' : '30-Second Check'}</button>
              </div>
              
            </div>
          </div>

        </div>
        {/each}
        </div>
    </div>
  </div>
{/if}  
