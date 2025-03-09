const ArticlePage = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center">
        <article className="bg-white p-8 rounded-lg shadow-lg max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Breaking News: the pope shows up at the BSA Hackathon</h1>

          <h2 className="text-xl mb-3 font-bold">Sthylé, the team that dared to dream</h2>
          <p className="text-gray-700">
            In the BC at EPFL lit by the glow of laptops and the occasional flicker of the coffee machine, Team Sthylé
            was battling against the clock. The mission: implement a cutting-edge image verification system using Hylé
            and Blockchain. The hackathon had started 1 hours ago, and the team had yet to sleep. Their vision was
            ambitious — a tool that could validate digital images, detect tampering, and authenticate visual content in
            real-time. But ambition often comes with obstacles.
          </p>
          <p className="text-gray-700 mt-4">
            The first hours passed in a flurry of brainstorming and wireframing. By morning, the team — composed of
            Rafael, Valentin, Rafael, Eric and Aymeric — had a basic architecture in place. Hylé devs were helping the
            team, but time was running out quickly. Unexpected bugs kept cropping up. As the first night wore on,
            frustration set in. They were behind schedule, and their vision felt increasingly out of reach.</p>
          <img src="./images/working-hard.png" className="w-1/2 mb-10" alt="Cervin"/>

          <h2 className="text-xl mb-3 font-bold">The struggle for understanding</h2>
          <p>Midnight struck, and Team StHylé was stuck. The different building blocks were refusing to cooperate.
            The real-time verification kept timing out, and attempts to optimize the back-end were met with cryptic
            errors.</p>
          <p>Eric tried to rally the team, but even his endless energy was waning. The team needed a miracle. And then
            the door creaked open.</p>
          <img src="./images/breakdown.jpg" className="w-1/2 mb-10 justify-center" alt="Cervin"/>

          <h2 className="text-xl mb-3 font-bold">Enter the Visionary</h2>
          <p>At 1 a.m., in walked none other than the pope. Dressed casually in his puffer jacket, he strolled into the
            room like it was the most natural thing in the world. “Heard you guys were building something cool,” he said
            with his characteristic grin. The room fell silent. Even the coffee machine seemed stunned.</p>
          <p>For the next hour, François listened intently as the team explained their struggles. He offered insights on
            optimizing Hylé’s API calls, suggested tweaks to their architecture, and shared his own experiences of
            late-night coding marathons. His presence re-energized the team. By 3 a.m., they had cracked the real-time
            verification issue. By dawn, the system was fully functional.</p>
          <img src="./images/pope.jpg" className="w-1/2 mb-10" alt="Cervin"/>

          <h2 className="text-xl mb-3 font-bold">The finish Line</h2>
          <p>When the hackathon ended, Team Sthylé presented their working prototype to a standing ovation. The tool
            they’d built had the potential to revolutionize digital media verification. And while their technical
            achievements were impressive, the real story was one of perseverance, teamwork, and an unexpected visit from
            a visionary at just the right moment.</p>

        </article>
      </div>
    );
};

export default ArticlePage;
  