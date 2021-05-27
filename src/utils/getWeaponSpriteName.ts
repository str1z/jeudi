const spriteNames = "knife rusty_sword regular_sword red_gem_sword big_hammer hammer baton_with_spikes mace katana saw_sword anime_sword axe machete cleaver duel_sword knight_sword golden_sword lavish_sword red_magic_staff green_magic_staff spear".split(" ")
export default function (i: number) {
    return "weapon_" + spriteNames[i]
}