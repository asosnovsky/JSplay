# =========================== # =========================== #
#     [P][Y][T][H][O][N] [P][O][P][U][L][A][T][I][O][N]     #
#               [S][I][M][U][L][A][T][O][R]                 #
# =========================== # =========================== #
"""
    The following program will simulate a simple population model.
    [Assumptions]:
        > All Death-factors are exponentially distributed and independent
        > Birth is assumed to have an inverse relationship to death, and is 
            depended on the population number.
    [Setup]:
        > Define 3 classes,
            * `Factor`: A class used to identify and sort all aspect 
                relating to a given factor. It will also contain methods for 
                random generation of factor-types.
                E.g. a Factor may be defined as such:
                    Sex     = Factor(["Male","Female"],[400   ,   200],[0.5      ,     0.5])
                    factor  = Factor([`Factor Types` ],[`death-rates`],[`occurrence rates`])

            * `Person`: A class used to store all information belonging to a given 
                person, as well as methods to induce aging and death.
                E.g. a Person may be initialized as follows:
                    Tom     = Person("Tom","Human","Male");
                    person  = Person(`Name`,`race`, `sex`);
                Note that `race and sex` relate to already defined factors.
            
            * `City`: A class used to store a group of persons. It also contains 
                methods for inducing aging on all its persons, as well as randomly-generated
                birth.
                E.g. a City may be initialized with 1000 people as follows:
                    Toronto = City("Toronto",1000               );
                    city    = City(`Name`   ,`Number of persons`);
                Then you may induce global aging 5 times (5 time-steps), as follows:
                    Toronto.pop_grow(5)

        > Use the classes defined to establish death-inducing factors.
            We do this by defining some factors as follows:
            `
                factors = {
                    "Sex"   : Factor(["Male","Female"],[600,700],[0.5,0.5]),
                    "Race"  : Factor(["Dwarf","Human","Elven"],[800,800,600],[0.25,0.5,0.25])
                }
            `
            We do the same with Names, mainly to make use of the random generation methods of the Factors class.
            `
                Names = Factor(["Johnny","Duke","Mike","Michelle","Lisa","Leia"])
            `

        > Use the assumptions made, and the Monti-Carlo method to generate random 
            instances of death and birth.
            The following is a method defined within the Person class:
            `
            def death(self):
                x = max(-(sum(self.get_factors_vals()))*log(random.random()),0)
                return min(x,max_age) < self.__age;
            `
                (The exponential-distribution was used for simplicity).
            A similar approach is then used to generate births, and is defined within the 
            City class. The following is a part of that method:
            `
                x = 1-exp(-len(self.__population)/sum(
                        [factors["Race"].val_trans(race), factors["Sex"].val_trans(sex)]
                    ));
                if x>random.random():
                    return {"name": name, "race": race, "sex": sex};
            `
            Note that the Factor-method `.val_trans`, returns the given factor's rate-of-death.
                (Death and Birth are assumed to have an inverse relationship, for simplicity).

        > Automate a loop that will induce aging, but will clock-out after a given point:
            The following is the population-growth method defined in the City Class:
            {{Notes}}
                (1) the function will start by checking to see if a specified number of 
                    loops is given, if it is, it will loop on the same function 
                    (with breaks of 1-second). If not, proceed to (2).
                (2) We loop through each person living.
                (3) *person.grow()* ages the person, and returns a True/False, as to 
                    whether the person has died. If the person has died, we omit them
                    from our list, and print to screen a message informing the user
                    of the person's death.
                (4) *self.birth()*, calls the City Class's birth method, it then returns
                    a True/False depending on if a person was born. If a person was born,
                    S/he is then added to our list, and a message is printed, informing
                    the user of a birth.
                (5) If a person has died this function will return True, otherwise False.
            {{Code}}
            `
             def pop_grow(self, growth=None):
                if growth is None:
                    for person in self.__population:
                            if person.grow():
                                del self.__population[[person.summary() == p.summary() for p in self.__population].index(True)];
                                print(person.summary_at_death())
                    
                    new_born = self.birth();
                    if new_born:
                        self.__population.append(Person(new_born["name"],new_born["race"],new_born["sex"]))
                        print(self.__population[len(self.__population)-1].summary_at_birth())
                else:
                    for t in range(1,growth):
                        if self.pop_grow():
                            print(self.summary(t));
                        time.sleep(1)
                return self;
            `

        > Define a City, and launch the growth!
"""
# ===========================
# Dependencies
# ===========================
# Packages
# ----------
import random
import time

# Functions
# ----------
from math import exp
from math import log
from operator import mul
from functools import reduce

## Cumulative sum
def cumsum(arr):
    fin = [arr[0]];
    for x in arr[1:]:fin.append(fin[len(fin)-1]+x);
    return fin;

## Simple Discrete Probability Model
def probModel(probs, res):
    cumtest = [0]+cumsum(probs);
    x = random.random();
    for p in range(1,len(cumtest)):
        if cumtest[p-1] <= x < cumtest[p]:
            return res[p-1];
    return res[len(res)-1];

# ===========================
# Global Variables
# ===========================
time_dt = 0.1;
max_time = 20;
max_age = 90;
# ===========================
# Classes
# ===========================
# Factors' Class
# ----------
class Factor(object):
    # Local Variables
    __freqs = [];# frequency of occurrence
    __names = [];# names of factor's category
    __vals = [];# rates of death
    # Initilization Function
    def __init__(self,names,vals=None,freqs=None):
        self.__names = names;
        if vals is not None:
            self.__vals = vals;
        else:
            self.__vals = [0] * len(names);
        if freqs is not None:
            self.__freqs = freqs;
        else:
            self.__freqs = [1/len(names)]*len(names);
    # Getters/Setters
    def get_names(self):
        return self.__names;
    # Methods
    def val_trans(self,name):
        if any(name in s for s in self.__names):
            return self.__vals[self.__names.index(name)];
        else:
            return 0;
    def add(self,name,val=0,freq=None):
        self.__names.append(name);

        if freq is None:
            freq = 1/len(self.__freqs);

        self.__freqs = [x * (1-freq) for x in self.__freqs]+[freq];
        self.__vals = [self.__vals]+[val];
        return self.__names;
    def gen_val(self):
        return probModel(self.__freqs,self.__names);

## Define Some Factors
# ------------------------------ #
factors = {
    "Sex"   : Factor(["Male","Female"],[60,70],[0.5,0.5]),
    "Race"  : Factor(["Dwarf","Human","Elven"],[80,70,90],[0.25,0.5,0.25])
};
Names = Factor(["Johnny","Duke","Mike","Michelle","Lisa","Leia"]);
# ------------------------------ #

# Persons' Class
# ----------
class Person:
    # Local Variables
    __name = "";# Name of person
    __age = 0;# Age of person
    __factors = {"Race":None,"Sex":None};# Factor types of person
    # Initilization Function
    def __init__(self, name=None, race=None, sex=None, age=0):
        if name is None:
            name = Names.gen_val();
        if race is None:
            race = factors["Race"].gen_val();
        if sex is None:
            sex = factors["Sex"].gen_val();
        if not any(name in s for s in Names.get_names()):
            Names.add(name);
        if not any(race in s for s in factors["Race"].get_names()):
            factors["Race"].add(race);
        self.__name             = name;
        self.__factors["Race"]  = race;
        self.__factors["Sex"]   = sex;
        self.__age              = age;
    # Setters and Getters
    def get_factors(self):
        return self.__factors;
    def get_factors_vals(self):
        return [factors[factor].val_trans(self.__factors[factor]) for factor in list(factors.keys())]
    def get_age(self):
        return self.__age;
    def get_name(self):
        return self.__name;
    # Methods
    def summary(self):
        return "{} the {}, {}, is {} years old.".format(self.__name,self.__factors["Race"],self.__factors["Sex"],self.__age)
    def summary_at_death(self):
        return "> {} the {}, {}, [[is dead]] at {} years old.".format(self.__name,self.__factors["Race"],self.__factors["Sex"],round(self.__age))
    def summary_at_birth(self):
        return "> {} the {}, {}, was just [[born]]!.".format(self.__name,self.__factors["Race"],self.__factors["Sex"])
    def grow(self):
        self.__age += time_dt;
        return self.death();
    def death(self):
        x = max(-(sum(self.get_factors_vals()))*log(random.random()),0);
        return min(x,max_age) < self.__age;
# City Class
# ----------
class City:
    __name = ""# Name of city
    __population = [];# Persons' list
    # Initilization Function
    def __init__(self, name, pop=random.randrange(0,100,1)):
        self.__name = name;
        self.__population = [Person(age=random.randrange(0,89,1)) for x in range(1,pop+1)];
    # Getters and Setters
    def set_city_name(self, name):
        self.__name = name;
        return name;
    def get_city_name(self):
        return self.__name;
    def get_pop_names(self):
        return [p.get_name() for p in self.__population];
    # Methods
    def summary(self,t=0):
        return "({})> {} has now {} people living in it.".format(t, self.__name,len(self.__population));
    def pop_grow(self, growth=None):
        if growth is None:
            for person in self.__population:
                    if person.grow():
                        del self.__population[[person.summary() == p.summary() for p in self.__population].index(True)];
                        print(person.summary_at_death());
            
            new_born = self.birth();
            if new_born:
                self.__population.append(Person(new_born["name"],new_born["race"],new_born["sex"]));
                print(self.__population[len(self.__population)-1].summary_at_birth());
        else:
            for t in range(1,growth):
                self.pop_grow();
                print(self.summary(t));
                time.sleep(1);
                if(len(self.__population) < 1):
                    break;

        return self;

    def birth(self,name=None, race=None,sex=None):
        if(len(self.__population) > 1):
            if name is None:
                name = Names.gen_val();
            if race is None:
                race = factors["Race"].gen_val();
            if sex is None:
                sex = factors["Sex"].gen_val();
            x = 1-exp(-len(self.__population)/sum(
                    [factors["Race"].val_trans(race), factors["Sex"].val_trans(sex)]
                ));
            if x>random.random():
                return {"name": name, "race": race, "sex": sex};
        else: 
            return False;

# ===========================
# Runtime
# ===========================

"""Uncomment this to see how this program works for single persons""" 
# Tom = Person("Tom");
# print(Tom.grow());
# print(Tom.summary());

"""The following is to show how the program works in general"""
Toronto = City("Toronto",100)
Toronto.pop_grow(max_time)
("[[END]]")

