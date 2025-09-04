import React  from 'react';
import TeamCarousel from './TeamCarousel';
import teamMembers from '../data/teamMembers';

const OPTIONS = {loop: true};


function Team() {
  return (
    <section className="relative bg-black bg-cover w-full h-[70vh] py-8">
      <TeamCarousel slides={teamMembers} options={OPTIONS} />
    </section>


  )
}

export default Team