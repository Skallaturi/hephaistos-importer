export function hephaistosQuery(): string {
	return `query($characterId:String!) {
  characters(readOnlyPermalinkId: [$characterId]) {
    inventory {
      __typename
      ...on CharacterArmor {
        maxDexBonusOverride
        kacBonusOverride
        eacBonusOverride
        isEquipped
        armor {
          __typename
          ...on NormalArmor {
            type
            maxDexBonus
            kacBonus
            eacBonus
          }
          ...on PoweredArmor {
            strength
            speed {
              speed
              type
            }
            maxDexBonus
            kacBonus
            eacBonus
          }
        }
      }
      ...on CharacterShield {
        maxDexBonusOverride
        alignedAcBonusOverride
        wieldAcBonusOverride
        isEquipped
        shield {
          maxDexBonus
          alignedAcBonus
          wieldAcBonus
        }
      }
      ...on CharacterAugmentation {
        augmentation{
            options{
                id
                effect
            }
        }
        selectedOptions {
          key
          value
        }
        isEquipped
        augmentation {
          type
        }
      }
      ...on ScalingArmor {
        override {
          strengthOverride
          speedAdjustmentOverride
          armorCheckPenaltyOverride
          maxDexBonusOverride
          kacBonusOverride
          eacBonusOverride
          isEquipped
        }
        armorPerksIds
        armorFlawsIds
        armorType
      }
    }
    shieldOverrides {
      proficiencyOverride
      armorCheckPenaltyOverride
      maxDexBonusOverride
      alignedAcBonusOverride
      wieldAcBonusOverride
      isEquipped
    }
    armorOverrides {
      strengthOverride
      proficiencyOverride
      armorCheckPenaltyOverride
      maxDexBonusOverride
      kacBonusOverride
      eacBonusOverride
      isEquipped
    }
    theme {
        selectedBenefitOptions{
            key
            value
        }
      theme {
        benefits{
            effect
            optionSelection
            options{
                id
                effect
            }
        }
      }
    }
    race {
      race {
        movement {
          speed
          type
        }
        abilityAdjustment {
        id
          effect
        }
        racialTraits {
          effect
          id
        }
        hitPoints
      }
      selectedAdjustment
      selectedTraits

    }
    save {
      fortitudeOverride
      fortitudeCustomBonus {
        id
        bonusType
        value
        dice {
          count
          sides
          modifier
        }
        source
        active
      }
      reflexOverride
      reflexCustomBonus {
        id
        bonusType
        value
        dice {
          count
          sides
          modifier
        }
        source
        active
      }
      willOverride
      willCustomBonus {
        id
        bonusType
        value
        dice {
          count
          sides
          modifier
        }
        source
        active
      }
    }
    resistance {
      srOverride
      erOverride {
        value
        damageType
      }
      drOverride {
        value
        damageType
      }
    }
    defence {
      cmdCustomBonus {
        id
        bonusType
        value
        dice {
          count
          sides
          modifier
        }
        source
        active
      }
      cmdOverride
      kacCustomBonus {
        id
        bonusType
        value
        dice {
          count
          sides
          modifier
        }
        source
        active
      }
      kacOverride
      eacCustomBonus {
        id
        bonusType
        value
        dice {
          count
          sides
          modifier
        }
        source
        active
      }
      eacOverride
    }
    initiativeOverride
    speed {
      override {
        speed
        type
      }
    }
    vitals {
      temporary
      hardness {
        damage
        override
      }
      stamina {
        damage
        override
      }
      health {
        damage
        override
      }
      resolve {
        damage
        override
      }
    }
    bonusRanks
    abilityScores {
      method
      increases
      cha {
        customBonus {
          id
          bonusType
          value
          dice {
            count
            sides
            modifier
          }
          source
          active
        }
        damage
        pointBuy
        base
        override
      }
      wis {
        customBonus {
          id
          bonusType
          value
          dice {
            count
            sides
            modifier
          }
          source
          active
        }
        damage
        pointBuy
        base
        override
      }
      int {
        customBonus {
          id
          bonusType
          value
          dice {
            count
            sides
            modifier
          }
          source
          active
        }
        damage
        pointBuy
        base
        override
      }
      con {
        customBonus {
          id
          bonusType
          value
          dice {
            count
            sides
            modifier
          }
          source
          active
        }
        damage
        pointBuy
        base
        override
      }
      dex {
        customBonus {
          id
          bonusType
          value
          dice {
            count
            sides
            modifier
          }
          source
          active
        }
        damage
        pointBuy
        base
        override
      }
      str {
        customBonus {
          id
          bonusType
          value
          dice {
            count
            sides
            modifier
          }
          source
          active
        }
        damage
        pointBuy
        base
        override
      }
    }
    classes{
        levels
        class{
            baseStaminaPoints
            hitPoints
            armorProficiencyDescription
            armorProficiency
        }
    }
    conditions {
      unconscious {
        override
      }
      stunned {
        override
      }
      staggered {
        override
      }
      stable {
        override
      }
      sickened {
        override
      }
      shaken {
        override
      }
      prone {
        override
      }
      pinned {
        override
      }
      paralyzed {
        override
      }
      panicked {
        override
      }
      overburdened {
        override
      }
      offTarget {
        override
      }
      offKilter {
        override
      }
      nauseated {
        override
      }
      helpless {
        override
      }
      grappled {
        override
      }
      frightened {
        override
      }
      flatFooted {
        override
      }
      fatigued {
        override
      }
      fascinated {
        override
      }
      exhausted {
        override
      }
      entangled {
        override
      }
      encumbered {
        override
      }
      dying {
        override
      }
      deafened {
        override
      }
      dead {
        override
      }
      dazzled {
        override
      }
      dazed {
        override
      }
      cowering {
        override
      }
      confused {
        override
      }
      burning {
        override
      }
      broken {
        override
      }
      blinded {
        override
      }
      bleeding {
        override
      }
      asleep {
        override
      }
    }
    name
    readOnlyPermalinkId
  }
}`;
}

export function graphQlTest(characterId: string): string {
	return (
		`query {
  characters(readOnlyPermalinkId: ["` +
		characterId +
		`"]) {
    readOnlyPermalinkId
    }
}`
	);
}
