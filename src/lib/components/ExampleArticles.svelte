<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{
    select: { headline: string; articleBody: string };
  }>();

  const exampleArticles = [
    {
      source: "CTV News Vancouver",
      title: "Cyclist dead after East Vancouver crash",
      content: `Cyclist dead after East Vancouver crash\nA man in his 60s died after being hit by a five-tonne truck while riding his bike in East Vancouver Thursday,\n\nFirst responders were called to the scene at Kingsway and Nanaimo Street around 12:30 p.m. for reports of the crash,\n\n"Despite life-saving attempts by first responders, the cyclist died at the scene," the Vancouver Police Department said in a statement, which added that the driver of the truck remained at the scene.\n\nAnyone with information or dash-cam video is urged to call the Collision Investigation Unit at 604-717-3012.`
    },
    {
      source: "The Straits Times",
      title: "One child killed after car ploughs into London primary school",
      content: `One child killed after car ploughs into London primary school\nLONDON - A girl was killed, and several other children were injured on Thursday after a car ploughed into a primary school building in south-west London, triggering a major response by emergency services. \n\nThe crash at the private Study Prep girls' school in Wimbledon, was not being treated by police as terror-related, and the driver – a woman in her 40s who stopped at the scene – was arrested.\n\nShe was detained on suspicion of causing death by dangerous driving, London's Metropolitan Police said, confirming the death of the child.\n\n\nEarlier, the force said seven children and two adults were injured in the crash, and the local MP said he understood several casualties were "being treated as critical".\n\nMr Stephen Hammond described the crash as "extraordinarily distressing and tragic".\n\nAerial footage of the scene – not far from where the Wimbledon tennis tournament was taking place – showed a Land Rover car stopped at an angle against the wall of the modern school building.\n\nThe vehicle was in a grassy area near what appeared to be coloured play mats and a table.\n\nThe police, ambulance and fire service were called to the scene in Camp Road, near Wimbledon Common, after the incident just before 10am (5pm Singapore time).\n\nWitnesses and reporters at the scene said the road outside the school was narrow, and it would normally have been difficult to build up any speed on it.\n\nThe Study Prep school takes in girls aged four to 11. It is split into several sites, with the youngest pupils taught in Camp Road, near the Royal Wimbledon Golf Club.\n\nThursday was the last day of term for children aged four to eight, according to the school's website.\n\n\n\nHealth Minister Steve Barclay called the incident "distressing".\n\n"My thoughts are with those sadly injured and everyone who has been affected," he added.\n\nLondon Mayor Sadiq Khan called it "absolutely devastating". \n\nAs well as police, crews from London Fire Brigade, London Ambulance Service and the London Air Ambulance were all called to deal with the incident. AFP`
    },
    {
      source: "NL Times",
      title: "Amsterdam taxi driver in custody after crash sends pedestrian to the hospital",
      content: `Amsterdam taxi driver in custody after crash sends pedestrian to the hospital\n\nOne person was injured in Amsterdam after a taxi struck them during the morning rush hour on Monday, police said. The driver of the vehicle was taken into custody for questioning.\n\nThe incident happened at about 8:15 a.m. on the west side of Linnaeusstraat near the intersection with Vrolikstraat in Amsterdam-Oost. Several squad cars raced to the scene, and at least two ambulances were dispatched to the location. They injured pedestrian was at the location, and a bicycle on its side was seen on the road.\n\n\n"The pedestrian was taken to hospital by ambulance," and Amsterdam police spokesperson told NL Times. Details were not released regarding the victim's age, gender, hometown and condition. Both ambulances left the site of the collision with their emergency lights flashing by 8:45 a.m.\n\nThe southbound lanes of Linnaeusstraat remained closed off for some time as the police investigation continued. The driver of the taxi was speaking to investigators at the scene. He was placed into custody while the investigation continues, police said.\n\n\nIn most cases, suspects in custody can be held for up to three days in detention before appearing before a magistrate during a criminal investigation. The magistrate can order suspects held for up to 14 days of pre-trial detention before they appear before a three-judge panel at a district court for arraignment`
    }
  ];

  function selectExample(index: number) {
    const selected = exampleArticles[index];
    // Extract headline (first line) and body (rest of the content)
    const lines = selected.content.trim().split('\n');
    const headline = lines[0].trim();
    const articleBody = lines.slice(1).join('\n').trim();
    
    dispatch('select', { headline, articleBody });
  }
</script>

<div class="mb-8">
  <p class="text-lg mb-4 text-black">Choose an example or paste your own article:</p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    {#each exampleArticles as example, i}
      <button 
        on:click={() => selectExample(i)}
        class="p-4 flex flex-col text-left border border-black transition-all hover:bg-red-700 hover:text-white hover:border-red-700 h-full"
      >
        <span class="text-xs uppercase tracking-wide font-semibold mb-2">{example.source}</span>
        <span class="font-bold">{example.title}</span>
      </button>
    {/each}
  </div>
</div> 