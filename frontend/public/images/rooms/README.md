# Room photos

Save the property photos here with **exactly these filenames** — the seeded
rooms reference them, and the site shows a labelled placeholder until they exist.

| Filename                    | Which photo                                                        | Used by                   |
| --------------------------- | ------------------------------------------------------------------ | ------------------------- |
| `family-living-suite.jpg`   | The living hall — sofas, carpet, blue feature wall, kitchen beyond  | Family Living Suite       |
| `deluxe-double.jpg`         | The turquoise room — queen bed, curtains, sofa in the corner        | Deluxe Double Room        |
| `standard-double.jpg`       | The light-blue room — wooden queen bed, open shelf, kitchen doorway | Standard Double Room      |
| `kitchen.jpg`               | The yellow modular kitchen — sink, counter, glass-front cabinets    | Kitchen Studio Apartment  |

Anything in `frontend/public/` is served from the site root, so a file saved as
`public/images/rooms/kitchen.jpg` is reachable at `/images/rooms/kitchen.jpg`.

JPG or PNG both work — if you save PNGs, update the paths in
`backend/seed.js` (or just edit each room's image field in the admin console).
