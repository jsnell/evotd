#!/usr/bin/perl -w

use strict;
use List::Util qw(shuffle max min);

my @monsters = (
    { name => 'Walker',hp => 50, reward => 1, speed => 3 },
    { name => 'BigWalker', hp => 150, reward => 2, speed => 1.5 },
    { name => 'Tank', hp => 2000, reward => 10, speed => 0.5 },
    { name => 'Speeder', hp => 150, reward => 5, speed => 5.0 },
    { name => 'Flier', hp => 90, reward => 3, speed => 2.0, fly => 1 },
);

for (@monsters) {
    my $difficulty = $_->{hp} * $_->{speed};
    if ($_->{fly}) {
        $difficulty *= 2;
    }
    $_->{difficulty} = $difficulty;
    # print $difficulty, " ", $_->{reward} / $difficulty;
}

my $reward_so_far = 0;
my $unspent_difficulty = 0;
my $total_difficulty = 0;
my $max_count = 20;

sub wanted_difficulty {
    my ($wave) = @_;
    100 + (100 * $wave ** 1.05 + 10 * $wave * sin($wave));
}

sub monster_for_difficulty {
    my ($difficulty) = @_;
    my @shuffled = shuffle @monsters;
    for (@shuffled) {
        return $_ if $_->{difficulty} < $difficulty;
    }
    undef;
}

for my $wave (1..100) {
    my $wanted_difficulty = wanted_difficulty $wave;
    my $remaining_difficulty = $wanted_difficulty + $unspent_difficulty;
    my @sources = shuffle 0..3;
    print "  [";
    for my $source (@sources) {
        my $difficulty_to_use = $remaining_difficulty;
        if (int rand(3) == 0) {
            # Send two 40% waves at the same time.
            $remaining_difficulty *= 0.8;
            $difficulty_to_use = $remaining_difficulty / 2;
        }
        my $monster = monster_for_difficulty $difficulty_to_use;
        last if !$monster;
        my $count = int $difficulty_to_use / $monster->{difficulty};
        $count = min $max_count, $count;

        my $max_interval = 1000 / $count;
        my $interval = 10 + int rand $max_interval;
        
        print "{ source: $source, type: $monster->{name}, count: $count, interval: $interval }, ";
        $remaining_difficulty -= $count * $monster->{difficulty};
        $reward_so_far += $count * $monster->{reward};
        $total_difficulty += $count * $monster->{difficulty};
    }
    print "],\n";
    $unspent_difficulty = $remaining_difficulty;
    # $reward_so_far += $wanted_difficulty * 0.008;    
}

print STDERR "difficulty=$total_difficulty reward=$reward_so_far\n";


