import React from "react";

function page() {
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

  return (
    <div>
      <iframe
        width="600"
        height="450"
        // style="border:0"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&q=Space+Needle,Seattle+WA`}
      ></iframe>
    </div>
  );
}

export default page;
